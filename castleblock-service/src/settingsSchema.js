import Joi from "joi";

const settingsSchema = Joi.object({
  debug: Joi.boolean()
    .default(false)
    .description("Outputs debug logs to stdout"),
  protocol: Joi.string().default("http").valid("http", "https"),
  host: Joi.string().hostname().default("localhost"),
  port: Joi.number().port().default(3000),
  statusMonitorEnable: Joi.boolean()
    .default(true)
    .description("Enables status monitor page at /status"),
  swaggerDocsEnable: Joi.boolean()
    .default(true)
    .description("Enables swagger API documentation page at /documentation"),
  assetPath: Joi.string()
    .default("./assets")
    .description("Directory path where the webapp assets are stored on disk."),
  homepage: Joi.string()
    .default("castleblock-ui")
    .description(
      "The app that should be displayed as the landing page for the service."
    ),
  basePath: Joi.string()
    .default("ui")
    .description("URL basepath where all apps are hosted under"),
  jwt: Joi.object({
    secret: Joi.string()
      .description("HS256 or HS512 Secret Key. Default is randomly generated.")
      .default(require("crypto").randomBytes(256).toString("base64")),
    maxAgeSec: Joi.number().integer().min(0).default(14400), // 4 hours
    timeSkewSec: Joi.number().integer().default(15),
  }).default(),
  oauth: Joi.object({
    provider: Joi.string().required(),
    password: Joi.string()
      .default(require("crypto").randomBytes(30).toString("base64"))
      .description(
        "The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps."
      ),
    clientId: Joi.string()
      .required()
      .description("the OAuth client identifier (consumer key)."),
    clientSecret: Joi.string()
      .required()
      .description("the OAuth client secret (consumer secret)."),
    isSecure: Joi.boolean().default(false),
    scope: Joi.array().items(Joi.string()),
  })
    .description(
      "OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options"
    )
    .unknown()
    .optional()
    .note(
      "Expects a bell auth strategy object.",
      "See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options"
    ),
  initialAdmins: Joi.array()
    .items(Joi.string())
    .description("List of usernames")
    .default([]),
  proxy: Joi.object({
    enabled: Joi.boolean().default(true),
    routes: Joi.array()
      .items({
        name: Joi.string().required(),
        version: Joi.string().required(),
        target: Joi.string().required(),
        method: Joi.alternatives(
          Joi.string(),
          Joi.array().items(Joi.string())
        ).default("*"),
        description: Joi.string(),
      })
      .default([]),
  }),
}).unknown();

export { settingsSchema };
