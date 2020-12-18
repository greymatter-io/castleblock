"use strict";
import fs from "fs";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import Inert from "@hapi/inert";
import Path from "path";
import { exec } from "child_process";

import { latestVersion, nextVersion } from "./versioning.js";

async function extract(path, name) {
  return new Promise((resolve, reject) => {
    console.log("Extracting...", `tar -xf ${path}${name}.tar.gz -C ${path}`);
    exec(
      `tar -xf ${path}${name}.tar.gz -C ${name} .`,
      function callback(error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error) {
          reject();
        }
        resolve();
      }
    );
  });
}
const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register([require("@hapi/inert")]);
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Homepage";
    },
  });

  server.route({
    method: "POST",
    path: "/package",
    options: {
      payload: {
        output: "stream",
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 100 * 2 * 1000 * 1000 * 1000,
      },
    },
    handler: (req, h) => {
      let dir = `./packages/${req.payload.name}/`;
      let next = nextVersion(latestVersion(dir), req.payload.version);
      //add the version to the dir path
      dir = `./packages/${req.payload.name}/${next}/`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      } else {
        fs.rmdirSync(dir, { recursive: true });
        fs.mkdirSync(dir);
      }
      const stream = req.payload.file.pipe(
        fs.createWriteStream(`${dir}${req.payload.name}.tar.gz`)
      );
      stream.on("finish", function () {
        extract(dir, req.payload.name);
      });

      return "DONE";
    },
  });

  server.route({
    method: "GET",
    path: "/package/{file*}",
    handler: {
      directory: {
        path: "packages",
        listing: true,
      },
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
