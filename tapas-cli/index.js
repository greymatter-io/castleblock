#!/usr/bin/env node

var exec = require("child_process").exec;
var cli = require("cli");
var chalk = require("chalk");
var fs = require("fs");

console.log(chalk.bold(chalk.cyan("Welcome to the tapas-cli")));
cli.info("Type --help for list of parameters");

const args = cli.parse({
  directory: ["d", "Directory containing your built assets", "file"],
  name: ["n", "Name of deployment", "string"],
  url: ["u", "URL to tapas service", "string", "localhost:3000"],
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
    exec(
      `tar -czvf ${args.name}.tar.gz -C ${args.directory} .`,
      function callback(error, stdout, stderr) {
        console.log(stdout);
        if (error) {
          reject();
        }
        resolve();
      }
    );
  });
}

async function upload() {
  console.log(chalk.cyan("Uploading..."));
  exec(
    `curl -X POST -F 'name=${args.name}' -F 'version=${args.version}' -F 'file=@./${args.name}.tar.gz' -F 'env=@./${args.env}' ${args.url}/deployment`,
    function callback(error, stdout, stderr) {
      cli.info(stdout);
    }
  );
}

console.log(`${chalk.bold("Name")}: ${chalk.cyan(args.name)}`);
console.log(`${chalk.bold("Package")}: ${chalk.cyan(args.directory)}`);

(async function () {
  await bundle();
  upload();
})();
