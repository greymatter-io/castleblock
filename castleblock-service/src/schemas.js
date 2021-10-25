import Joi from "joi";
import semver from "semver";

const manifest = Joi.object({
  short_name: Joi.string().required(),
  version: Joi.string()
    .custom(function (value, helpers) {
      if (!semver.valid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "Semantic Version of the application")
    .required(),
  description: Joi.string(),
  icons: Joi.array().items(
    Joi.object({
      src: Joi.string().required(),
    }).unknown(true)
  ),
}).unknown(true);

export default { manifest };
