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
//Example path: /<assetName>/my-app/2.3.4/
const assetName = process.env.ASSETNAME || "ui";
const directory = "./assets";

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
      return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width,initial-scale=1'>
          <link rel='icon' type='image/png' href='./${assetName}/tapas-ui/latest/favicon.png'>
          <link rel='stylesheet' href='./${assetName}/tapas-ui/latest/global.css'>
          <link rel='stylesheet' href='./${assetName}/tapas-ui/latest/build/bundle.css'>
          <script defer src='./${assetName}/tapas-ui/latest/build/bundle.js'></script>
        </head>

        <body>
        <tapas-ui></tapas-ui>
        </body>
        </html>
        `;
    },
  });

  server.route({
    method: "POST",
    path: `/deployment`,
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
      let dir = `${directory}/${req.payload.name}/`;
      let next = nextVersion(
        latestVersion(req.payload.name, directory),
        req.payload.version
      );
      console.log("Version:", next);
      //add the version to the dir path
      dir = createPath(`${directory}/${req.payload.name}/${next}/`);

      console.log("dir", dir);

      const stream = req.payload.file.pipe(
        fs.createWriteStream(`${dir}${req.payload.name}.tar.gz`)
      );
      stream.on("finish", function () {
        extract(dir, req.payload.name);
      });

      const envStream = req.payload.env.pipe(
        fs.createWriteStream(`${dir}env.json`)
      );
      envStream.on("finish", function () {
        console.log("done writing env");
      });

      return `Deployed: http://${host}:${port}/${assetName}/${req.payload.name}/${next}/`;
    },
  });

  server.route({
    method: "GET",
    path: `/${assetName}/{file*}`,
    handler: {
      directory: {
        path: `${directory}`,
        listing: true,
      },
    },
  });

  server.route({
    method: "GET",
    path: `/deployments`,
    handler: () => {
      return getDirectories(`${directory}/`).map((deployment) => {
        return {
          name: deployment,
          versions: versions(deployment, directory),
          path: `/${assetName}/${deployment}`,
        };
      });
    },
  });

  server.route({
    method: "GET",
    path: `/${assetName}/{file}/latest/{end*}`,
    handler: (request, h) => {
      const v = latestVersion(request.path.split("/")[2], directory);
      let pathToFile = request.path
        .substring(1)
        .replace(assetName, directory)
        .replace("latest", v);

      //if a directory is requested append index.html
      pathToFile = pathToFile.endsWith("/")
        ? pathToFile + "index.html"
        : pathToFile;

      return h.file(pathToFile);
      return h.redirect(`${request.path.replace("latest", v)}`).permanent();
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
