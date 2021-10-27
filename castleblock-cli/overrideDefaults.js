import fs from "fs";
import os from "os";
import path from "path";

export default function overrideDefaults(options) {
  const homeConfigPath = path.join(os.homedir(), ".castleblock.json");
  const localConfigPath = path.join(".castleblock.json");
  let c;
  let overridePath;
  if (fs.existsSync(homeConfigPath)) {
    overridePath = homeConfigPath;
    c = JSON.parse(fs.readFileSync(homeConfigPath)).config;
  }
  if (fs.existsSync(localConfigPath)) {
    overridePath = localConfigPath;
    c = JSON.parse(fs.readFileSync(localConfigPath)).config;
  }
  if (c) {
    console.log("Loading default overrides", overridePath);
    Object.keys(c).forEach((key) => {
      if (options[key]) {
        options[key][3] = c[key];
      }
    });
  }
  return options;
}
