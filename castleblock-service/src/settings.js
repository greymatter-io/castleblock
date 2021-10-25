import chalk from "chalk";
import Joi from "joi";
import fs from "fs";
import _ from "lodash";
import cli from "cli";

import { settingsSchema } from "./settingsSchema.js";

const options = cli.parse({
  config: ["c", "JSON Configuration file for castleblock", "file"],
});

let settings = {};
if (options.config) {
  try {
    settings = JSON.parse(fs.readFileSync(options.config));
  } catch (error) {
    console.error(chalk.red(`Problem reading ${options.config} file.`));
    console.error(error);
    process.exit(1);
  }
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

console.debug("CLI options", options, process.argv);
console.debug("Settings:", JSON.stringify(settings, null, 2));

export default settings;
