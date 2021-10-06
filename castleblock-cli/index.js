import cli from "cli";
import crypto from "crypto";
import chalk from "chalk";
import fs from "fs";
import tar from "tar";
import Path from "path";
import axios from "axios";
import FormData from "form-data";
import chokidar from "chokidar";
import childProcess from "child_process";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { generateSlug } from "random-word-slugs";

const adhocVersion = generateSlug();
let adhocURL = "";

//CLI commands and options
const commands = ["deploy", "watch", "remove"];
const args = cli.parse(
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
    deployURL: [null, "Deployment URL to be removed", "string"],
    package: ["p", "Name of tar.gz file", "string", "deployment.tar.gz"],
  },
  commands
);

//This script is run in /bin/castleblock
export async function init(argv) {
  //Check for valid command
  if (!commands.includes(cli.command)) {
    cli.fatal(`${cli.command} is an unknown command`);
  }

  //Read manifest from build directory

  switch (cli.command) {
    case "deploy":
      await build();
      await compress();
      await deploy();
      break;
    case "watch":
      watch();
      break;
    case "remove":
      await remove(args.deployURL);
      break;
    default:
    // code block
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

async function build() {
  if (args.build) {
    cli.info(`Building Project: ${args.build}`);
    return await execWithPromise(args.build);
  }
}

async function compress() {
  return new Promise((resolve, reject) => {
    cli.info(
      `Compressing ${chalk.cyan(args.dist)} into ${chalk.cyan(
        `${args.package}`
      )}`
    );
    tar
      .c(
        {
          file: `${args.package}`,
        },
        [`${Path.join(args.dist, "/")}`]
      )
      .then((_) => {
        resolve();
      })
      .catch((e) => {
        cli.fatal(e)
        reject(e);
      });
  });
}

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
  cli.info(`Uploading ${args.package}`, adhoc);

  var form = new FormData();
  const rs = fs.createReadStream(`./${args.package}`);
  form.append("file", rs);
  if (adhoc) {
    form.append("adhoc", adhoc);
  }
  if (args.env) {
    form.append("env", fs.createReadStream(`./${args.env}`));
  }

  form.append(
    "manifest",
    fs.createReadStream(Path.join(args.dist, "manifest.json"))
  );

  const sha512 = await hash(fs.createReadStream(`./${args.package}`));
  cli.info(`${chalk.bold("SHA512:")}\n      ${chalk.cyan(sha512)}`);

  axios
    .post(`${args.url}/deployment`, form, {
      headers: form.getHeaders(),
    })
    .then((response) => {
      adhocURL = response.data.url;
      cli.info(`URL: ${response.data.url}`);
    })
    .catch((error) => {
      console.log(error.response.data.message);
      cli.error(error.response.data.message);
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
  // One-liner for current directory

  cli.info(
    `${chalk.bold("Watching For Changes")}\n      Source Directory: "${
      args.src
    }"\n      Build Command: "${args.build}"`
  );

  chokidar
    .watch(args.src, {
      ignoreInitial: true,
      ignored: [`${args.dist}`, "*.tar.gz", ".*"], // ignore dotfiles
      interval: 5000,
    })
    .on("ready", async () => {
      await build();
      await compress();
      await deploy(adhocVersion);
    })
    .on("change", async (event, path) => {
      await build();
      await compress();
      await deploy(adhocVersion);
      cli.info(event, path);
    });
  process.on("SIGINT", async function () {
    cli.info("Caught interrupt signal, stopping now.");
    await remove(adhocURL);
    process.exit();
  });
}
