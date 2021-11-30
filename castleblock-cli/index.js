import cli from "cli";
import crypto from "crypto";
import chalk from "chalk";
import fs from "fs";
import tar from "tar-fs";
import Path from "path";
import axios from "axios";
import FormData from "form-data";
import chokidar from "chokidar";
import childProcess from "child_process";
import { nanoid } from "nanoid";
import slugify from "slugify";
import Jwt from "@hapi/jwt";
import clone from "git-clone/promise";

import overrideDefaults from "./overrideDefaults.js";

const adhocVersion = "adhoc-" + Math.random().toString(36).slice(2);
let adhocURL = "";
//CLI commands and options
const commands = ["deploy", "watch", "remove", "login", "version", "list"];

let options = cli.parse(
  overrideDefaults({
    dist: ["d", "Directory containing the built assets", "file", "./build"],
    url: ["u", "URL to castleblock service", "string", "http://localhost:3000"],
    env: [
      "e",
      "Include env file in deployment (accessible from ./env.json when deployed)",
      "file",
    ],
    build: [
      "b",
      "Build command that is run before deployment",
      "string",
      "npm run build",
    ],
    src: ["s", "Source directory to watch for changes", "file", "./src"],
    file: ["f", "Deploy an existing package", "file"],
    pack: ["p", "Save deployment package to disk", "bool", false],
    token: ["t", "Authorization Token", "string"],
    jwtSecret: [
      "j",
      "JWT Secret Key for generating a token on the fly",
      "string",
    ],
    remote: ["r", "Deploy a remote git repo or tarball", "string"],
  }),
  commands
);

async function getRemote() {
  fs.rmSync("/tmp/castleblock", { recursive: true, force: true });
  if (options.remote.endsWith(".tar")) {
    cli.info(`Downloading ${options.remote}`);
    await new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: options.remote,
        responseType: "stream",
      }).then(function (response) {
        const file = fs.createWriteStream("/tmp/castleblock-deployment.tar");
        response.data.pipe(file);
        options.file = "/tmp/castleblock-deployment.tar";
        options.remote = null;
        file.on("finish", function () {
          file.close();
          resolve();
        });
      });
    });
  } else {
    cli.info(`Cloning ${options.remote}`);
    await clone(options.remote, "/tmp/castleblock");
    process.chdir("/tmp/castleblock");
    cli.info(`Installing npm packages`);
    await execWithPromise("npm i");
  }
}

const args = cli.args;

function validateHtml(path) {
  if (!fs.existsSync(path)) {
    cli.fatal(
      "Missing index.html file. This file is the required entry point to your application."
    );
  } else {
    const htmlString = fs.readFileSync(path);
    if (htmlString.includes(`'/`) || htmlString.includes(`"/`)) {
      cli.error(
        "The index.html file appears to have absolute paths. Please make them relative paths."
      );
    } else {
      cli.info("index.html checks out fine.");
    }
  }
}

//Print specific error if it exists
function getError(error) {
  return error &&
    error.response &&
    error.response.data &&
    error.response.data.message
    ? error.response.data.message
    : error;
}

//This script is run in /bin/castleblock
export async function init(argv) {
  //Check for valid command
  if (!commands.includes(cli.command)) {
    cli.fatal(`${cli.command} is an unknown command`);
  }

  if (options.jwtSecret) {
    //generate a token
    options.token = Jwt.token.generate(
      {
        aud: "urn:audience:castleblock-developers",
        iss: "urn:issuer:castleblock-service",
        username: "admin",
      },
      options.jwtSecret
    );
  }

  switch (cli.command) {
    case "deploy":
      console.log(options);
      await deploy();
      break;
    case "watch":
      console.log(options);
      watch();
      break;
    case "remove":
      if (!args[0]) cli.fatal("Missing app URL\ncastleblock remove [URL]");
      await remove(args[0]);
      break;
    case "login":
      const tokensPath = Path.join(
        require("os").homedir(),
        ".castleblock.json"
      );
      let tokens = {};
      if (fs.existsSync(tokensPath)) {
        //get existing file
        tokens = JSON.parse(fs.readFileSync(tokensPath));
      }
      tokens[options.url] = options.token;
      fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2));
      cli.info("Logged in");
    case "version":
      cli.info("v" + require("./package.json").version);
      process.exit();
    case "list":
      function formatList(response, wc = false) {
        response.data.map((app) => {
          let out = `${chalk.bold.cyan(app.name)}${
            wc ? chalk.green(" (wc)") : ""
          }\n`;
          out += `  ${options.url}/ui/${app.name}/latest\n`;
          app.versions.map((v) => {
            out += `  ${options.url}/ui/${app.name}/${v}\n`;
          });
          console.log(out);
        });
      }
      axios
        .get(`${options.url}/apps`)
        .then((response) => {
          formatList(response);
        })
        .catch((error) => {
          cli.fatal(getError(error));
        });
      axios
        .get(`${options.url}/webcomponents`)
        .then((response) => {
          formatList(response, true);
        })
        .catch((error) => {
          cli.fatal(getError(error));
        });
  }
}

const execWithPromise = async (command) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(childProcess.execSync(command, { cwd: process.cwd() }));
    } catch (error) {
      reject(error);
    }
  });
};
function hash(stream) {
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash("sha512");
    hasher.setEncoding("hex");
    stream.pipe(hasher).on("finish", function () {
      resolve(hasher.read());
    });
  });
}

function savePackage(pkg) {
  if (options.pack) {
    const manifest = JSON.parse(
      fs.readFileSync(Path.join(options.dist, "manifest.json"))
    );
    cli.info(`Saving package: ${manifest.short_name}-${manifest.version}.tar`);
    pkg.pipe(
      fs.createWriteStream(`${manifest.short_name}-${manifest.version}.tar`)
    );
  }
}

function appendToken(headers) {
  if (options.token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${options.token}`,
      Accept: "application/json",
    };
  } else {
    // See if there are any saved tokens
    const tokensPath = Path.join(require("os").homedir(), ".castleblock.json");
    if (fs.existsSync(tokensPath)) {
      //get existing file
      const tokens = JSON.parse(fs.readFileSync(tokensPath));
      if (tokens[options.url]) {
        headers = {
          ...headers,
          Authorization: `Bearer ${tokens[options.url]}`,
          Accept: "application/json",
        };
      }
    }
  }
  return headers;
}
async function deploy(adhoc) {
  cli.info(`Compressing ${chalk.cyan(options.dist)}`);
  let pack;
  if (options.remote) {
    console.log("GETTING REMOTE");
    await getRemote();
  }
  if (!options.file) {
    cli.info(`Building Project: ${options.build}`);
    await execWithPromise(options.build);
    if (!fs.existsSync(`${Path.join(options.dist)}`)) {
      cli.fatal(
        ` dist directory: "${Path.join(options.dist)}" does not exists!`
      );
    }
    validateHtml(Path.join(options.dist, "index.html"));
    pack = tar.pack(`${Path.join(options.dist)}`);
    savePackage(pack);
  }

  var form = new FormData();

  if (options.file) {
    form.append("tarball", fs.createReadStream(options.file));
    cli.info(
      `${chalk.bold("SHA512:")}\n      ${chalk.cyan(
        await hash(fs.createReadStream(`${options.file}`))
      )}`
    );
  } else {
    form.append("tarball", pack, {
      filename: "deployment.tar",
    });
    cli.info(`${chalk.bold("SHA512:")}\n      ${chalk.cyan(await hash(pack))}`);
  }
  if (adhoc) {
    form.append("adhoc", adhoc);
  }
  if (options.env) {
    form.append("env", fs.createReadStream(`./${options.env}`));
  }

  cli.info(`Uploading Package`, adhoc, form);

  let headers = form.getHeaders();
  headers = appendToken(headers);

  axios
    .post(`${options.url}/deployment`, form, {
      headers: headers,
    })
    .then((response) => {
      adhocURL = response.data.url;
      cli.info(`URL: ${response.data.url}`);
    })
    .catch((error) => {
      if (getError(error) == "Token maximum age exceeded") {
        cli.info(`Get a new token: ${options.url}/login`);
      }
      cli.fatal(getError(error));
    });
}

async function remove(url) {
  cli.info("Deleting Deployment", url);
  await axios
    .delete(url, { headers: appendToken({}) })
    .then((response) => {
      cli.info(response.data);
    })
    .catch((error) => cli.error(getError(error)));
}

function watch() {
  cli.info(
    `${chalk.bold("Watching For Changes")}\n      Source Directory: "${
      options.src
    }"\n      Build Command: "${options.build}"`
  );

  chokidar
    .watch(options.src, {
      ignoreInitial: true,
      ignored: [`${options.dist}`, "*.tar", ".*"], // ignore dotfiles
      interval: 5000,
    })
    .on("ready", async () => {
      await deploy(adhocVersion);
    })
    .on("change", async (event, path) => {
      await deploy(adhocVersion);
      cli.info(event, path);
    });
  process.on("SIGINT", async function () {
    cli.info("Caught interrupt signal, stopping now.");
    await remove(adhocURL);
    process.exit();
  });
}
