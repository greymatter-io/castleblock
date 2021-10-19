import cli from "cli";
import crypto from "crypto";
import chalk from "chalk";
import fs from "fs";
import tar from "tar-fs";
import tarStream from "tar-stream";
import Path from "path";
import axios from "axios";
import FormData from "form-data";
import chokidar from "chokidar";
import childProcess from "child_process";
import { nanoid } from "nanoid";
import slugify from "slugify";

const adhocVersion = "adhoc-" + Math.random().toString(36).slice(2);
let adhocURL = "";

//CLI commands and options
const commands = ["deploy", "watch", "remove"];
const options = cli.parse(
  {
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
  },
  commands
);
console.log(options);
const args = cli.args;

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

  switch (cli.command) {
    case "deploy":
      await deploy();
      break;
    case "watch":
      watch();
      break;
    case "remove":
      if (!args[0]) cli.fatal("Missing app URL\ncastleblock remove [URL]");
      await remove(args[0]);
      break;
  }
}

const execWithPromise = async (command) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(childProcess.execSync(command));
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

async function deploy(adhoc) {
  cli.info(`Compressing ${chalk.cyan(options.dist)}`);
  let pack;
  if (!options.file) {
    cli.info(`Building Project: ${options.build}`);
    await execWithPromise(options.build);
    if (!fs.existsSync(`${Path.join(options.dist)}`)) {
      cli.fatal(
        ` dist directory: "${Path.join(options.dist)}" does not exists!`
      );
    }
    pack = tar.pack(`${Path.join(options.dist)}`);
    savePackage(pack);
  }

  var form = new FormData();

  if (options.file) {
    form.append("tarball", fs.createReadStream(`./${options.file}`));
    cli.info(
      `${chalk.bold("SHA512:")}\n      ${chalk.cyan(
        await hash(fs.createReadStream(`./${options.file}`))
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
  if (options.token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${options.token}`,
      Accept: "application/json",
    };
  }

  axios
    .post(`${options.url}/deployment`, form, {
      headers: headers,
    })
    .then((response) => {
      adhocURL = response.data.url;
      cli.info(`URL: ${response.data.url}`);
    })
    .catch((error) => {
      cli.fatal(getError(error));
    });
}

async function remove(url) {
  cli.info("Deleting Deployment", url);
  await axios
    .delete(url)
    .then((response) => {
      cli.info(response.data);
    })
    .catch((error) => cli.error(error));
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
