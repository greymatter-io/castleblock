import chalk from "chalk";
import Joi from "joi";
import fs from "fs";

let settings;
try {
  settings = JSON.parse(fs.readFileSync("./settings.json"));
} catch (error) {
  console.log(chalk.red("Problem reading ./settings.json file."));
  console.log(error);
  process.exit(1);
}

const settingsSchema = Joi.object({
  port: Joi.number().port().default(3000),
  host: Joi.string().hostname().default("localhost"),
  corsProxyEnable: Joi.boolean().default(true),
  originWhitelist: Joi.array().items(Joi.string().domain()).default([]),
  statusMonitorEnable: Joi.boolean().default(true),
  swaggerDocsEnable: Joi.boolean().default(true),
  assetPath: Joi.string().default("./assets"),
  homepage: Joi.string().default("castleblock-ui"),
  basePath: Joi.string().default("ui"),
  authStrategy: Joi.object().default(null),
  jwtSecret: Joi.string(),
})
  .and("authStrategy", "jwtSecret")
  .unknown()
  .meta({ name: "My Schema", filename: "mySchema" });

const { error, value } = settingsSchema.validate(settings, {
  abortEarly: false,
});
if (error) {
  console.log(chalk.yellow(error));
  process.exit(1);
}

settings = value;
console.log(settings);

export default settings;
