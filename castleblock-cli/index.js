import cli from "cli";
import chalk from "chalk";
import fs from "fs";
import tar from "tar";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import chokidar from "chokidar";
import childProcess from "child_process";
import { nanoid } from "nanoid";

console.log(chalk.bold(chalk.cyan("Welcome to the castleblock cli")));
cli.info("Type --help for list of parameters");

const args = cli.parse({
  directory: ["d", "Directory containing the built assets", "file"],
  name: ["n", "Name of deployment", "string"],
  url: ["u", "URL to castleblock service", "string", "http://localhost:3000"],
  version: ["v", "Increment Version", "string"],
  env: [
    "e",
    "Include env file in deployment (accessible from ./env.json when deployed)",
    "file",
  ],
  watch: [
    "w",
    "Watch the current directory, then build and deploy when a file changes.",
    "directory",
  ],
  build: ["b", "Build command that is run before deployment", "string"],
  remove: ["r", "Remove deployment"],
});

//Check for required variables

if (!args.name && !args.watch) {
  cli.error(
    'Please include a name for your deployment. i.e. --name "my-deployment"'
  );
  process.exit(1);
}
if (!args.directory && !args.remove) {
  cli.error(
    'Please include a directory to your build assets i.e. --directory"./build"'
  );
  process.exit(1);
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
    return await execWithPromise(args.build);
  }
}
async function bundle() {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan("Packaging..."));
    tar
      .c(
        {
          gzip: "czvf",
          file: `${args.name}.tar.gz`,
        },
        [`${path.join(args.directory, "/")}`]
      )
      .then((_) => {
        resolve();
      })
      .catch(() => reject());
  });
}

async function upload() {
  console.log(chalk.cyan("Uploading..."));

  var form = new FormData();
  if (args.name) {
    form.append("name", args.name);
  }
  if (args.version) {
    form.append("version", args.version);
  }
  form.append("file", fs.createReadStream(`./${args.name}.tar.gz`));
  if (args.env) {
    form.append("env", fs.createReadStream(`./${args.env}`));
  }

  axios
    .post(`${args.url}/deployment`, form, { headers: form.getHeaders() })
    .then((response) => {
      cli.info(response.data);
    })
    .catch((error) => cli.error(error));
}

async function remove() {
  console.log("Deleting Deployment");
  await axios
    .delete(
      `${args.url}/deployment/${args.name}${
        args.version ? `/${args.version}` : ""
      }`
    )
    .then((response) => {
      cli.info(response.data);
    })
    .catch((error) => cli.error(error));
}

function watch() {
  // One-liner for current directory

  console.log(`${chalk.bold("Watching")}: ${args.watch} for changes.`);
  args.name = nanoid(10);

  args.version = "0.0.1";
  chokidar
    .watch(args.watch, {
      ignoreInitial: true,
      ignored: [`${args.directory}`], // ignore dotfiles
    })
    .on("all", async (event, path) => {
      await build();
      await bundle();
      await upload();
      console.log(event, path);
    });
}

console.log(`${chalk.bold("Name")}: ${chalk.cyan(args.name)}`);
console.log(`${chalk.bold("Package")}: ${chalk.cyan(args.directory)}`);

export async function start(argv) {
  process.on("SIGINT", async function () {
    console.log("Caught interrupt signal");
    if (args.watch) {
      await remove();
    }
    process.exit();
  });
  if (args.remove) {
    await remove();
  } else if (args.watch) {
    //Watch for changes
    watch();
  } else {
    //Package and Deploy
    await build();
    await bundle();
    await upload();
  }
}
