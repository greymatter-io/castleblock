import ReadableStreamClone from "readable-stream-clone";
import fs from "fs";
import tarFS from "tar-fs";
import Boom from "@hapi/boom";
import Joi from "joi";
import Path from "path";
import slugify from "slugify";

import utils from "./utils.js";
import settings from "./settings.js";
import schemas from "./schemas.js";

import adhoc from "./adhoc.js";

export default [
  {
    method: "GET",
    path: "/",
    options: {
      description: "Get homepage",
      notes: "Returns index.html of the homepage",
      tags: ["api"],
    },

    handler: () => {
      console.debug(
        Path.join(
          `${settings.assetPath}/${settings.homepage}/${utils.latestVersion(
            settings.homepage,
            settings.assetPath
          )}/index.html`
        )
      );

      const homepagePath = Path.join(
        settings.assetPath,
        settings.homepage,
        utils.latestVersion(settings.homepage, settings.assetPath),
        "index.html"
      );
      let htmlFile = fs.readFileSync(homepagePath);
      return utils.injectBasePath(
        htmlFile,
        `${Path.join(
          settings.basePath,
          settings.appsPath,
          settings.homepage,
          utils.latestVersion(settings.homepage, settings.assetPath)
        )}/`
      );
    },
  },

  {
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
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: Joi.object({
          tarball: Joi.any().meta({ swaggerType: "file" }).required(),
          adhoc: Joi.string().optional(),
          env: Joi.any().optional().meta({ swaggerType: "file" }),
        }).label("Deployment"),
      },
      auth: {
        strategy: "jwt",
      },
    },
    handler: async (req) => {
      const stream1 = new ReadableStreamClone(req.payload.tarball);
      const stream2 = new ReadableStreamClone(req.payload.tarball);
      const stream3 = new ReadableStreamClone(req.payload.tarball);

      //Fetch manifest from package
      let manifest;
      try {
        manifest = await utils.extractManifest(stream1);
      } catch (error) {
        return Boom.badRequest(error);
      }
      console.debug(manifest);

      // Validate the manifest.json
      const manifestValidation = schemas.manifest.validate(manifest);
      if (manifestValidation.error) {
        return Boom.badRequest("manifest.json: " + manifestValidation.error);
      }

      //Determine path for deployment
      const appPath = Path.join(
        slugify(manifest.short_name),
        req.payload.adhoc ? req.payload.adhoc : manifest.version
      );

      //Create directory for deployment
      const destination = Path.join(`${settings.assetPath}`, appPath);
      utils.createPath(destination, true);

      // Extract tarball
      console.debug("Starting Extraction");
      stream2.pipe(tarFS.extract(destination));

      //Save original tar file to disk for archive
      utils.writeStream(
        stream3,
        Path.join(
          destination,
          `${slugify(manifest.short_name)}-${manifest.version}.tar`
        )
      );

      console.debug(req.auth.artifacts.decoded.payload.username);
      // Generate metadata info.json
      const info = {
        deploymentDate: new Date(),
        deploymentBy: req.auth.artifacts.decoded.payload.username,
        package: `${slugify(manifest.short_name)}-${manifest.version}.tar`,
        sha512: await utils.hash(stream2),
      };

      // Write metadata to disk
      fs.writeFileSync(
        Path.join(destination, "info.json"),
        JSON.stringify(info)
      );

      //If env file is included, write it to disk
      if (req.payload.env) {
        await utils.writeStream(
          req.payload.env,
          Path.join(destination, "env.json")
        );
      }

      console.debug(info);

      if (req.payload.adhoc) {
        // Inject hot-reloading client and refresh any connected clients for this app..
        adhoc.updateClients(appPath);
        adhoc.injectHotReloadClient(Path.join(destination, "index.html"));
      }

      return {
        appPath: appPath,
        url: `http://${settings.host}:${settings.port}/${Path.join(
          settings.appsPath,
          appPath
        )}`,
      };
    },
  },

  {
    method: "GET",
    path: "/refresh",
    handler: function (request, h) {
      adhoc.addClient(h);
      //initialize SSE connection
      return h.event({ data: "hotreloading enabled" });
    },
    options: {
      description: "SSE subscription for hot-reloading",
      notes: "Initializes a SSE connection",
      tags: ["api"],
    },
  },
  {
    method: "DELETE",
    path: `/${settings.appsPath}/{name}/{version}/`,
    handler: (req) => {
      console.debug("REMOVEING", req.params.name, req.params.version);
      adhoc.removeClients(req.params.name, req.params.version);

      //Remove specific version
      fs.rmdirSync(
        Path.join(settings.assetPath, req.params.name, req.params.version),
        {
          recursive: true,
        }
      );
      //Remove parent directory if empty
      if (
        fs.readdirSync(Path.join(`${settings.assetPath}`, `${req.params.name}`))
          .length === 0
      ) {
        fs.rmdirSync(Path.join(`${settings.assetPath}`, `${req.params.name}`), {
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
      auth: {
        strategy: "jwt",
      },
    },
  },
  {
    method: "GET",
    path: `/apps`,
    handler: () => {
      return utils
        .getDirectories(`${settings.assetPath}/`)
        .map((deployment) => {
          if (utils.versions(deployment, settings.assetPath).length) {
            const m = utils.readManifest(deployment);
            if (!m.webcomponent) {
              return {
                name: deployment,
                versions: utils.versions(deployment, settings.assetPath),
                path: Path.join(settings.appsPath, deployment),
                latestManifest: Path.join(
                  `${settings.appsPath}`,
                  `${deployment}`,
                  `${utils.latestVersion(deployment, settings.assetPath)}`,
                  "manifest.json"
                ),
              };
            }
          }
        })
        .filter(Boolean);
    },
    options: {
      description: "List all apps",
      notes: "Returns app names, versions, and path to app",
      tags: ["api"],
    },
  },
  {
    method: "GET",
    path: `/webcomponents`,
    handler: () => {
      return utils
        .getDirectories(`${settings.assetPath}/`)
        .map((deployment) => {
          if (utils.versions(deployment, settings.assetPath).length) {
            const m = utils.readManifest(deployment);
            if (m.webcomponent) {
              return {
                name: deployment,
                versions: utils.versions(deployment, settings.assetPath),
                path: Path.join(settings.basePath, settings.appsPath, deployment),
                latestManifest: Path.join(
                  settings.basePath,
                  settings.appsPath,
                  deployment,
                  utils.latestVersion(deployment, settings.assetPath),
                  "manifest.json"
                ),
              };
            }
          }
        })
        .filter(Boolean);
    },
    options: {
      description: "List all webcomponents",
      notes:
        "Returns webcomponent names, versions, and path to example documentation page",
      tags: ["api"],
    },
  },
  {
    method: "GET",
    path: `/${settings.appsPath}/{file*}`,
    handler: {
      directory: {
        path: Path.normalize(`${settings.assetPath}`),
        listing: true,
        etagMethod: "hash",
      },
    },
    options: {
      description: "Fetch homepage assets",
      notes: "Returns html, js, css, and other UI assets",
      tags: ["api"],
    },
  },

  {
    method: ["GET", "DELETE"],
    path: `/${settings.appsPath}/{appName}/{version}`,
    handler: (req, h) => {
      return h.redirect(`${req.path}/`).permanent();
    },
  },

  {
    method: "GET",
    path: `/${settings.appsPath}/{appName}/{version}/{end*}`,
    handler: (request, h) => {
      const v =
        request.params.version == "latest"
          ? utils.latestVersion(request.params.appName, settings.assetPath)
          : request.params.version;

      let pathToFile = request.path
        .substring(1)
        .replace(settings.appsPath, settings.assetPath)
        .replace("latest", v);

      //if a directory is requested append index.html
      if (pathToFile.endsWith("/")) {
        let htmlFile = fs.readFileSync(pathToFile + "index.html");
        return utils.injectBasePath(
          htmlFile,
          `${Path.join(settings.basePath, settings.appsPath, request.params.appName, v)}/`
        );
      }

      return h.file(pathToFile, {
        etagMethod: "hash",
      });
    },
    options: {
      description: `Fetch ${settings.appsPath} assets for the latest version of the deployment`,
      tags: ["api"],
    },
  },
];
