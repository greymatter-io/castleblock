import joiToMd from "joi-to-md";
import fs from "fs";

import { settingsSchema } from "./src/settingsSchema.js";

fs.writeFileSync(
  "configuration.md",
  "# Castleblock castleblock.json\n\n" + joiToMd(settingsSchema)
);
console.log("configuration.md");
