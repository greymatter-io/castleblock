"use strict";
import fs from "fs";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import Inert from "@hapi/inert";
import Path from "path";
import { exec } from "child_process";

import {
  versions,
  latestVersion,
  nextVersion,
  getDirectories,
} from "./versioning.js";

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

//This is just used in the path when requesting a microfrontend
//Examples: package, ui, mf, app
const assetName = process.env.ASSETNAME || "package";

async function extract(path, name) {
  return new Promise((resolve, reject) => {
    console.log("Extracting...", `tar -xf ${path}${name}.tar.gz -C ${path}`);
    exec(
      `tar -xf ${path}${name}.tar.gz -C ${path}`,
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

function createPath(p) {
  fs.mkdirSync(p, { recursive: true });
  return p;
}

const init = async () => {
  const server = Hapi.server({
    port,
    host,
  });

  await server.register([require("@hapi/inert")]);
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.file("./src/tapas-ui.html");
    },
  });

  server.route({
    method: "POST",
    path: `/${assetName}`,
    options: {
      payload: {
        output: "stream",
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 100 * 2 * 1000 * 1000 * 1000,
      },
    },
    handler: (req, h) => {
      console.log("Creating Package");
      let dir = `./package/${req.payload.name}/`;
      let next = nextVersion(latestVersion(dir), req.payload.version);
      console.log("Version:", next);
      //add the version to the dir path
      dir = createPath(`./package/${req.payload.name}/${next}/`);
      console.log("dir", dir);

      const stream = req.payload.file.pipe(
        fs.createWriteStream(`${dir}${req.payload.name}.tar.gz`)
      );
      stream.on("finish", function () {
        extract(dir, req.payload.name);
      });

      return `Deployed: http://${host}:${port}/${assetName}/${req.payload.name}/${next}/`;
    },
  });

  server.route({
    method: "GET",
    path: `/${assetName}/{file*}`,
    handler: {
      directory: {
        path: `package`,
        listing: true,
      },
    },
  });

  server.route({
    method: "GET",
    path: `/${assetName}`,
    handler: () => {
      return getDirectories(`./package/`).map((pack) => {
        return {
          name: pack,
          versions: versions(`./package/${pack}`),
        };
      });
    },
  });

  server.route({
    method: "GET",
    path: `/${assetName}/{file}/latest/{end*}`,
    handler: (request, reply) => {
      const v = latestVersion(`.${request.path.split("/latest")[0]}`);
      return reply.redirect(`${request.path.replace("latest", v)}`).permanent();
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
