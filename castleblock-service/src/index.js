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
import tar from "tar";
import Path from "path";
import Status from "hapijs-status-monitor";

import {
  versions,
  latestVersion,
  nextVersion,
  getDirectories,
} from "./versioning.js";

function hash(stream) {
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

function getManifestPath(dir) {
  const path = Path.join(dir, "manifest.json");
  if (fs.existsSync(path)) {
    return `/${path.replace(Path.posix.basename(assetPath), basePath)}`;
  } else {
    return null;
  }
}

async function extract(path, name) {
  return new Promise((resolve, reject) => {
    console.log("Extracting...", `tar -xf ${path}${name}.tar.gz -C ${path}`);
    fs.createReadStream(Path.join(`${path}`, `/${name}.tar.gz`)).pipe(
      tar.x({
        strip: 1,
        C: `${path}`, // alias for cwd:'some-dir', also ok
      })
    );
  });
}

function createPath(p) {
  fs.mkdirSync(p, { recursive: true });
  return p;
}

const init = async () => {
  console.log("Origins:", originWhitelist);
  const server = Hapi.server({
    port,
    host,
  });

  await server.register([Inert, H2o2, Vision]);
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

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset='utf-8'>
          <meta name='viewport' content='width=device-width,initial-scale=1'>
          <link rel='icon' type='image/png' href='./${basePath}/castleblock-ui/latest/favicon.png'>
          <link rel='stylesheet' href='./${basePath}/castleblock-ui/latest/global.css'>
          <link rel='stylesheet' href='./${basePath}/castleblock-ui/latest/build/bundle.css'>
          <script defer src='./${basePath}/castleblock-ui/latest/build/bundle.js'></script>
        </head>

        <body>
        <castleblock-ui></castleblock-ui>
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
      description: "Create new deployment",
      notes: "Returns the location of the new deployment",
      tags: ["api"],
    },
    handler: async (req, h) => {
      let next = nextVersion(
        latestVersion(req.payload.name, assetPath),
        req.payload.version
      );

      const dir = createPath(
        Path.join(`${assetPath}`, `${req.payload.name}`, `${next}`)
      );

      console.log(
        `\nCreating Package:\nName: ${req.payload.name}\nVersion: ${next}\nLocation: ${dir}\n\n`
      );
      if (req.payload.env) {
        const envStream = req.payload.env.pipe(
          fs.createWriteStream(Path.join(`${dir}`, `env.json`))
        );
        envStream.on("finish", function () {
          console.log("done writing env");
        });
      }
      const stream = req.payload.file.pipe(
        fs.createWriteStream(Path.join(`${dir}`, `/${req.payload.name}.tar.gz`))
      );
      stream.on("finish", async function () {
        extract(dir, req.payload.name);
        const metadata = {
          deploymentDate: new Date(),
          sha512: await hash(
            fs.createReadStream(
              Path.join(`${dir}`, `/${req.payload.name}.tar.gz`)
            )
          ),
        };
        fs.writeFileSync(
          Path.join(`${dir}`, `/info.json`),
          JSON.stringify(metadata)
        );
        console.log("Deployment Date:", metadata.deploymentDate);
        console.log("SHA512:", metadata.sha512);

        console.log(
          `New App Deployed: http://${host}:${port}/${basePath}/${req.payload.name}/${next}/`
        );
      });
      return `Deployed: http://${host}:${port}/${basePath}/${req.payload.name}/${next}/`;
    },
  });

  server.route({
    method: "DELETE",
    path: `/deployment/{name}/{version?}`,
    handler: (req) => {
      console.log(
        `REMOVING: ${req.params.name} version: ${req.params.version}`
      );
      if (req.params.version) {
        //Remove specific version
        fs.rmdirSync(
          Path.join(
            `${assetPath}`,
            `${req.params.name}`,
            `${req.params.version}`
          ),
          {
            recursive: true,
          }
        );

        //Remove parent directory if empty
        if (
          fs.readdirSync(Path.join(`${assetPath}`, `${req.params.name}`))
            .length === 0
        ) {
          fs.rmdirSync(Path.join(`${assetPath}`, `${req.params.name}`), {
            recursive: true,
          });
        }
      } else {
        //Remove all versions
        fs.rmdirSync(Path.join(`${assetPath}`, `${req.params.name}`), {
          recursive: true,
        });
      }

      return `Removed ${req.params.name}`;
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
      return getDirectories(`${assetPath}/`).map((deployment) => {
        return {
          name: deployment,
          versions: versions(deployment, assetPath),
          path: `/${basePath}/${deployment}`,
          latestManifest: getManifestPath(
            Path.join(
              `${assetPath}`,
              `${deployment}`,
              `${latestVersion(deployment, assetPath)}`
            )
          ),
        };
      });
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
      description: "Fetch UI assets",
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
      pathToFile = pathToFile.endsWith("/")
        ? pathToFile + "index.html"
        : pathToFile;

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
