import fs from "fs";
import os from "os";
import path from "path";

export default function overrideDefaults(options) {
  const homeConfigPath = path.join(os.homedir(), ".castleblock.json");
  const localConfigPath = path.join(".castleblock.json");
  if (fs.existsSync(homeConfigPath)) {
    const c = JSON.parse(fs.readFileSync(homeConfigPath)).config;
    if (c) {
      Object.keys(c).forEach((key) => {
        if (options[key]) {
          options[key][3] = c[key];
        }
      });
      console.log("Defaults set by ~/castleblock.json");
    }
  }
  if (fs.existsSync(localConfigPath)) {
    const c = JSON.parse(fs.readFileSync(localConfigPath));
    console.log("Defaults set by ./castleblock.json");
    Object.keys(c).forEach((key) => {
      if (options[key]) {
        options[key][3] = c[key];
      }
    });
  }
  return options;
}
