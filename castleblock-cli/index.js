#!/usr/bin/env node

var cli = require("cli");
var chalk = require("chalk");
var fs = require("fs");
var tar = require("tar");
var path = require("path");
var axios = require("axios");
var FormData = require("form-data");

console.log(chalk.bold(chalk.cyan("Welcome to the castleblock cli")));
cli.info("Type --help for list of parameters");

const args = cli.parse({
  directory: ["d", "Directory containing your built assets", "file"],
  name: ["n", "Name of deployment", "string"],
  url: ["u", "URL to castleblock service", "string", "http://localhost:3000"],
  version: ["v", "Increment Version", "string"],
  env: [
    "e",
    "Include env file in deployment (accessible from ./env.json when deployed)",
    "file",
  ],
});

//Check for required variables

if (!args.name) {
  cli.error(
    'Please include a name for your deployment. i.e. --name "my-deployment"'
  );
  process.exit(1);
}
if (!args.directory) {
  cli.error(
    'Please include a directory to your build assets i.e. --directory"./build"'
  );
  process.exit(1);
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

console.log(`${chalk.bold("Name")}: ${chalk.cyan(args.name)}`);
console.log(`${chalk.bold("Package")}: ${chalk.cyan(args.directory)}`);

(async function () {
  await bundle();
  upload();
})();
