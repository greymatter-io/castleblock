import Joi from "joi";
import _ from "lodash";

function indent(level) {
  let str = "";
  for (var i = 0; i < level; i++) {
    str = str + " ";
  }
  return str;
}
export default function joiToMd(
  schema,
  level = 0,
  output = "",
  name = "Schema Docs"
) {
  if (level == 0) {
    schema = schema.describe();
    output += `# ${name}\n\n`;
  }
  if (schema.type == "object") {
    Object.keys(schema.keys).forEach((key) => {
      output += indent(level) + `* **\`${key}\`** `;
      output += ` (type: ${_.get(schema, `keys[${key}].type`)}) `;
      output += _.get(schema, `keys[${key}].flags.description`)
        ? `: ${_.get(schema, `keys[${key}].flags.description`)}\n`
        : "\n";

      if (typeof _.get(schema, `keys[${key}].flags.default`) == "object") {
        if (_.get(schema, `keys[${key}].flags.default`).special != "deep") {
          output +=
            " (default: `" +
            JSON.stringify(_.get(schema, `keys[${key}].flags.default`)) +
            "`) ";
        }
      } else {
        output +=
          " (default: `" + _.get(schema, `keys[${key}].flags.default`) + "`)";
      }
      if (_.get(schema, `keys[${key}].type`) == "object") {
        output = joiToMd(schema.keys[key], level + 2, output + "\n");
      }
      if (_.get(schema, `keys[${key}].notes`)) {
        output += "\n" + indent(level + 2) + "**notes:** \n";
        _.get(schema, `keys[${key}].notes`).forEach((note) => {
          output += indent(level + 4) + "* " + note + "\n";
        });
      }

      output += "\n";
    });
  }
  return output;
}
