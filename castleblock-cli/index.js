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

const adhocVersion = "adhoc-" + Math.random().toString(36).slice(2);
let adhocURL = "";

//CLI commands and options
const commands = ["deploy", "watch", "remove", "package"];
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
  },
  commands
);
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

  //Read manifest from build directory

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

async function deploy(adhoc) {
  cli.info(`Compressing ${chalk.cyan(options.dist)}`);

  if (options.build) {
    cli.info(`Building Project: ${options.build}`);
    await execWithPromise(options.build);
  }
  if (!fs.existsSync(`${Path.join(options.dist)}`)) {
    cli.fatal(` dist directory: "${Path.join(options.dist)}" does not exists!`);
  }
  const pack = tar.pack(`${Path.join(options.dist)}`);

  var form = new FormData();
  form.append("file", pack, {
    filename: "deployment.tar",
  });
  if (adhoc) {
    form.append("adhoc", adhoc);
  }
  if (options.env) {
    form.append("env", fs.createReadStream(`./${options.env}`));
  }

  const sha512 = await hash(pack);
  cli.info(`${chalk.bold("SHA512:")}\n      ${chalk.cyan(sha512)}`);

  cli.info(`Uploading Package`, adhoc);
  axios
    .post(`${options.url}/deployment`, form, {
      headers: form.getHeaders(),
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
