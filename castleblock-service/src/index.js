"use strict";
import fs from "fs";
import Hapi from "@hapi/hapi";
import crypto from "crypto";
import H2o2 from "@hapi/h2o2";
import Boom from "@hapi/boom";
import Inert from "@hapi/inert";
import Joi from "joi";
import Vision from "@hapi/vision";
import Wreck from "@hapi/wreck";
import HapiSwagger from "hapi-swagger";
import tarFS from "tar-fs";
import tarStream from "tar-stream";
import Path from "path";
import Status from "hapijs-status-monitor";
import slugify from "slugify";
import semver from "semver";
import susie from "susie";
import ReadableStreamClone from "readable-stream-clone";

import {
  versions,
  latestVersion,
  nextVersion,
  getDirectories,
} from "./versioning.js";

let adhocClients = [];

function hash(stream) {
  //const stream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    const hasher = crypto.createHash("sha512");
    hasher.setEncoding("hex");
    stream.pipe(hasher).on("finish", function () {
      resolve(hasher.read());
    });
  });
}

function setEnv(envVar, defaultValue, format) {
  if (typeof envVar === "undefined") {
    return defaultValue;
  } else {
    if (format === "json") {
      return JSON.parse(envVar);
    }
    return envVar;
  }
}

// Options / Settings
const port = setEnv(process.env.PORT, 3000);
const host = setEnv(process.env.HOST, "localhost");
const corsProxyEnable = setEnv(process.env.CORS_PROXY_ENABLE, true);
const originWhitelist = setEnv(process.env.ORIGIN_WHITELIST, [], "json");
//["https://google.com", "https://reddit.com"] is an example whitelist
const statusMonitorEnable = setEnv(process.env.STATUS_MONITOR_ENABLE, true);
const swaggerDocsEnable = setEnv(process.env.SWAGGER_DOCS_ENABLE, true);
const assetPath = Path.normalize(setEnv(process.env.ASSET_PATH, "./assets"));
const basePath = setEnv(process.env.BASE_PATH, "ui"); //Example path: <castleblock-service.url>/<basePath>/my-app/2.3.4/
const homepage = setEnv(process.env.HOMEPAGE, `castleblock-ui`);

function createPath(p, clearExisting) {
  if (clearExisting) {
    fs.rmdirSync(p, { recursive: true });
  }
  fs.mkdirSync(p, { recursive: true });
  return p;
}

const init = async () => {
  console.log("Origins:", originWhitelist);
  const server = Hapi.server({
    port,
    host,
  });

  await server.register([Inert, H2o2, Vision, susie]);
  if (swaggerDocsEnable) {
    await server.register([
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: "API Documentation",
            version: "0.0.1",
          },
        },
      },
    ]);
  }
  if (statusMonitorEnable) {
    await server.register([
      {
        plugin: Status,
        options: {
          title: "CastleBlock Status Monitor",
          routeConfig: {
            auth: false,
          },
        },
      },
    ]);
  }

  //Allow proxying to other services
  server.route({
    method: "*",
    path: `/proxy/{url*}`,
    options: {
      validate: {
        params: async (value, options, next) => {
          const url = new URL(value.url);
          if (originWhitelist.includes(url.origin)) {
            return value;
          } else {
            throw Boom.badRequest(
              `${url.origin} is not a whitelisted service. Contact your administrator.`
            );
          }
        },
      },

      description: "CORS Proxy",
      notes: `Make requests to other origins. The current whitelist includes the following origins: ${originWhitelist.join(
        ", "
      )}`,
      tags: ["api"],
    },
    handler: {
      proxy: {
        mapUri: function (request) {
          return {
            uri: `${request.params.url}`,
          };
        },

        passThrough: true,
        xforward: true,
      },
    },
  });

  function injectBasePath(htmlString, relPath) {
    return `${htmlString}`.replace(
      "<head>",
      `<head><base href="${relPath}" />`
    );
  }

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      console.log(
        Path.join(
          `${assetPath}/${homepage}/${latestVersion(
            homepage,
            assetPath
          )}/index.html`
        )
      );

      const homepagePath = Path.join(
        assetPath,
        homepage,
        latestVersion(homepage, assetPath),
        "index.html"
      );
      let htmlFile = fs.readFileSync(homepagePath);
      return injectBasePath(
        htmlFile,
        `/${Path.join(basePath, homepage, latestVersion(homepage, assetPath))}/`
      );
    },
  });

  async function writeStream(stream, filePath) {
    return new Promise((resolve, reject) => {
      console.log("test", filePath);
      const s = stream.pipe(fs.createWriteStream(filePath));
      s.on("finish", function () {
        console.log("finished writing", filePath);
        resolve();
      });
    });
  }

  function readStream(stream) {
    let data;
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
        data = data ? data + chunk : chunk;
      });
      stream.on("end", () => {
        resolve(data);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    });
  }

  async function getManifest(oldTarballStream) {
    let extract = tarStream.extract();
    let manifest;
    await new Promise((resolve, reject) => {
      extract.on("entry", async function (header, stream, callback) {
        // write the new entry to the pack stream
        if (header.name == "manifest.json") {
          manifest = JSON.parse(await readStream(stream));
          resolve();
        }
        callback();
      });

      oldTarballStream.pipe(extract);
    });
    return manifest;
  }

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
      description: "Create new deployment",
      notes: "Returns the location of the new deployment",
      tags: ["api"],
    },
    handler: async (req, h) => {
      // Validate the manifest.json
      //const manifest = JSON.parse(await readStream(req.payload.manifest));

      const stream1 = new ReadableStreamClone(req.payload.file);
      const stream2 = new ReadableStreamClone(req.payload.file);
      const manifest = await getManifest(stream1);
      console.log(manifest);

      const manifestSchema = Joi.object({
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
      }).unknown(true);

      const manifestValidation = manifestSchema.validate(manifest);
      if (manifestValidation.error) {
        return Boom.badRequest(manifestValidation.error);
      }

      //Determine path for deployment
      const appPath = Path.join(
        slugify(manifest.short_name),
        req.payload.adhoc ? req.payload.adhoc : manifest.version
      );

      //Create directory for deployment
      const destination = Path.join(`${assetPath}`, appPath);
      createPath(destination, true);

      // Extract tarball
      console.log("Starting Extraction");
      stream2.pipe(tarFS.extract(destination));

      // Generate metadata info.json
      const info = {
        deploymentDate: new Date(),
        sha512: await hash(stream2),
      };

      // Write metadata to disk
      fs.writeFileSync(
        Path.join(destination, "info.json"),
        JSON.stringify(info)
      );

      //If env file is included, write it to disk
      if (req.payload.env) {
        await writeStream(req.payload.env, Path.join(destination, "env.json"));
      }

      console.log("Deployment Date:", info.deploymentDate);
      console.log("SHA512:", info.sha512);
      const out = `http://${host}:${port}/${Path.join(basePath, appPath)}`;
      console.log(out);

      if (req.payload.adhoc) {
        console.log("ADHOC Clients:", adhocClients.length);
        adhocClients = adhocClients
          .map((c) => {
            console.log("cinfo", c.request.info.referrer);
            if (c.request.info.referrer.includes(appPath)) {
              c.event({
                data: "refresh",
              });
              return null;
            }
            return c;
          })
          .filter(Boolean);

        console.log("ADHOC Clients:", adhocClients.length);
        //read index.html
        let htmlFile = fs.readFileSync(Path.join(destination, "index.html"));

        //insert script
        htmlFile = `${htmlFile}`.replace(
          "</body>",
          `<script>
          var source = new EventSource('/refresh');source.onmessage = function(e) { console.log(e); if(e.data=="refresh"){ location.reload();}}</script></body>`
        );

        //save file
        fs.writeFileSync(Path.join(destination, "index.html"), htmlFile);
      }

      return {
        appPath: appPath,
        url: `http://${host}:${port}/${Path.join(basePath, appPath)}`,
      };
    },
  });

  server.route({
    method: "GET",
    path: "/refresh",
    handler: function (request, h) {
      adhocClients = adhocClients.concat([h]);
      console.log("ADHOC Clients:", adhocClients.length);
      return h.event({ data: "hotreloading enabled" });
    },
  });

  server.route({
    method: "DELETE",
    path: `/${basePath}/{name}/{version}`,
    handler: (req) => {
      console.log(
        `REMOVING: ${req.params.name} version: ${req.params.version}`
      );
      adhocClients = adhocClients.filter(
        (c) =>
          !c.request.info.referrer.includes(
            `${req.params.name}/${req.params.version}`
          )
      );

      console.log("ADHOC Clients:", adhocClients.length);

      //Remove specific version
      fs.rmdirSync(Path.join(assetPath, req.params.name, req.params.version), {
        recursive: true,
      });
      //Remove parent directory if empty
      if (
        fs.readdirSync(Path.join(`${assetPath}`, `${req.params.name}`))
          .length === 0
      ) {
        fs.rmdirSync(Path.join(`${assetPath}`, `${req.params.name}`), {
          recursive: true,
        });
      }

      return `Removed ${req.params.name} ${req.params.version}`;
    },

    options: {
      description: "Delete Deployment",
      notes: "Removes deployment from the service.",
      tags: ["api"],
      validate: {
        params: Joi.object({
          name: Joi.string()
            .required()
            .description("The name of the deployment"),
          version: Joi.string().description("The version of the deployment"),
        }),
      },
    },
  });

  server.route({
    method: "GET",
    path: `/deployments`,
    handler: () => {
      return getDirectories(`${assetPath}/`)
        .map((deployment) => {
          if (versions(deployment, assetPath).length) {
            return {
              name: deployment,
              versions: versions(deployment, assetPath),
              path: `/${basePath}/${deployment}`,
              latestManifest: Path.join(
                `${basePath}`,
                `${deployment}`,
                `${latestVersion(deployment, assetPath)}`,
                "manifest.json"
              ),
            };
          }
        })
        .filter(Boolean);
    },
    options: {
      description: "List all deployments",
      notes: "Returns deployment names, versions, and path to deployment",
      tags: ["api"],
    },
  });

  server.route({
    method: "GET",
    path: `/${basePath}/{file*}`,
    handler: {
      directory: {
        path: Path.normalize(`${assetPath}`),
        listing: true,
      },
    },
    options: {
      description: "Fetch homepage assets",
      notes: "Returns html, js, css, and other UI assets",
      tags: ["api"],
    },
  });

  server.route({
    method: "GET",
    path: `/${basePath}/{appName}/{version}`,
    handler: (req, h) => {
      return h.redirect(`${req.path}/`).permanent();
    },
  });

  server.route({
    method: "GET",
    path: `/${basePath}/{appName}/{version}/{end*}`,
    handler: (request, h) => {
      const v =
        request.params.version == "latest"
          ? latestVersion(request.params.appName, assetPath)
          : request.params.version;

      let pathToFile = request.path
        .substring(1)
        .replace(basePath, assetPath)
        .replace("latest", v);

      //if a directory is requested append index.html
      if (pathToFile.endsWith("/")) {
        let htmlFile = fs.readFileSync(pathToFile + "index.html");
        return injectBasePath(
          htmlFile,
          `/${Path.join(basePath, request.params.appName, v)}/`
        );
      }

      return h.file(pathToFile);
    },
    options: {
      description: `Fetch ${basePath} assets for the latest version of the deployment`,
      tags: ["api"],
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
