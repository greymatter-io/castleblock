import chalk from "chalk";
import fs from "fs";
import _ from "lodash";
import cli from "cli";
import util from "util";

import { settingsSchema } from "./settingsSchema.js";

const options = cli.parse({
  config: ["c", "JSON Configuration file for castleblock", "file"],
});

let settings = {};
if (options.config && fs.existsSync(options.config)) {
  try {
    settings = JSON.parse(fs.readFileSync(options.config));
  } catch (error) {
    console.error(chalk.red(`Problem reading ${options.config} file.`));
    console.error(error);
  }
} else {
  console.error(
    chalk.red(`Problem reading ${options.config} file. Does not exist`)
  );
}

//console.log(joiToDoc(settingsSchema, 0, "", "Castleblock settings.json"));
const { error, value } = settingsSchema.validate(settings, {
  abortEarly: false,
});
if (error) {
  console.error(chalk.yellow(error));
  process.exit(1);
}

settings = value;
console.debug = function () {
  if (settings.debug) {
    console.log(chalk.cyan("DEBUG:"), ...arguments);
  }
};

function hide(data, secrets) {
  let newData = _.cloneDeep(data);
  Object.keys(newData).forEach((key) => {
    if (typeof newData[key] === "object") {
      newData[key] = hide(newData[key], secrets);
    }
    const hasSecret = secrets.some((secret) => {
      return key.toLowerCase().includes(secret);
    });
    if (hasSecret) {
      newData[key] = "*******Hidden*******";
    }
  });
  return newData;
}

console.debug("CLI options", options, process.argv);
console.log(
  "Settings:",
  util.inspect(hide(settings, ["secret", "password"]), {
    showHidden: false,
    depth: null,
    colors: true,
  })
);
export default settings;
