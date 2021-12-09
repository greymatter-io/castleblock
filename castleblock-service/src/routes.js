import ReadableStreamClone from "readable-stream-clone";
import fs from "fs";
import tarFS from "tar-fs";
import Boom from "@hapi/boom";
import Joi from "joi";
import Path from "path";
import slugify from "slugify";
import glob from "fast-glob";
import child_process from "child_process";

import utils from "./utils.js";
import settings from "./settings.js";
import schemas from "./schemas.js";

import adhoc from "./adhoc.js";

function createApiRoutes(apiPath) {
  console.log("creating api routes", apiPath);
  const functions = glob.sync("**/*.js", { cwd: apiPath });
  console.log("functions", functions);

  functions.map((func) => {
    // Create a route for this function
    // need to strip off file extension
    console.log("func", func);
    const endpoint = func.split(".")[0];
    console.log("endpoint", endpoint);

    routes.push({
      method: "GET",
      path: `/dynamicapi/${endpoint}`,
      handler: async (request, h) => {
        // const funcPath = Path.join(apiPath, func);
        // const funcModule = require(funcPath);
        // const func = funcModule.default || funcModule;
        // console.log("func", func);
        // const result = await func(request, h);
        const result = "HELLO WORLD";
        return result;
      },
    });
  });
}

function loadDynamicRoutes() {
  utils.getDirectories(settings.assetPath).map((app) => {
    console.log("a", app);
    utils.getDirectories(Path.join(settings.assetPath, app)).map((version) => {
      console.log("v", version);
      const appPath = Path.join(settings.assetPath, app, version);
      const apiPath = Path.join(appPath, "api");
      console.log("appPath", appPath);
      console.log("apiPath", apiPath);
      if (fs.existsSync(appPath)) {
        const files = fs.readdirSync(appPath);
        console.log("files", files);
      }
      if (fs.existsSync(apiPath)) {
        console.log("api exists", apiPath);
        createApiRoutes(apiPath);
      }
    });
  });
}

const routes = [
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
        `/${Path.join(
          settings.basePath,
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
      const tarball = req.payload.tarball;
      const stream1 = new ReadableStreamClone(tarball);
      const stream2 = new ReadableStreamClone(tarball);
      const stream3 = new ReadableStreamClone(tarball);

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

      console.log("appPath", appPath);

      //Create directory for deployment
      const destination = Path.join(`${settings.assetPath}`, appPath);
      utils.createPath(destination, true);

      // Extract tarball
      await new Promise((resolve, reject) => {
        stream2
          .pipe(tarFS.extract(destination))
          .on("finish", resolve)
          .on("error", reject);
      });

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
        try {
          const path = Path.join(destination, "index.html");
          adhoc.injectHotReloadClient(path);
        } catch (e) {
          console.log(
            "Something went wrong with the hot reloading injection",
            e
          );
        }
      }

      return {
        appPath: appPath,
        url: `http://${settings.host}:${settings.port}/${Path.join(
          settings.basePath,
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
    path: `/${settings.basePath}/{name}/{version}/`,
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
                path: `/${settings.basePath}/${deployment}`,
                latestManifest: Path.join(
                  `${settings.basePath}`,
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
                path: `/${settings.basePath}/${deployment}`,
                latestManifest: Path.join(
                  `${settings.basePath}`,
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
      description: "List all webcomponents",
      notes:
        "Returns webcomponent names, versions, and path to example documentation page",
      tags: ["api"],
    },
  },
  {
    method: "GET",
    path: `/${settings.basePath}/{file*}`,
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
    path: `/${settings.basePath}/{appName}/{version}`,
    handler: (req, h) => {
      return h.redirect(`${req.path}/`).permanent();
    },
  },

  {
    method: "GET",
    path: `/${settings.basePath}/{appName}/{version}/{end*}`,
    handler: (request, h) => {
      const v =
        request.params.version == "latest"
          ? utils.latestVersion(request.params.appName, settings.assetPath)
          : request.params.version;

      let pathToFile = request.path
        .substring(1)
        .replace(settings.basePath, settings.assetPath)
        .replace("latest", v);

      //if a directory is requested append index.html
      if (pathToFile.endsWith("/")) {
        let htmlFile = fs.readFileSync(pathToFile + "index.html");
        return utils.injectBasePath(
          htmlFile,
          `/${Path.join(settings.basePath, request.params.appName, v)}/`
        );
      }

      return h.file(pathToFile, {
        etagMethod: "hash",
      });
    },
    options: {
      description: `Fetch ${settings.basePath} assets for the latest version of the deployment`,
      tags: ["api"],
    },
  },
  {
    method: "GET",
    path: `/${settings.basePath}/{appName}/{version}/api/{end*}`,
    handler: (request, h) => {
      const { appName, version, end } = request.params;
      console.log("lets dynamically handle an api request", end);
      const appPath = Path.join(settings.assetPath, appName, version);
      const apiPath = Path.join(appPath, "api");

      const funcPath = Path.join(apiPath, end) + ".js";
      const fileExists = fs.existsSync(funcPath);
      console.log("apiPath", apiPath);
      console.log("funcPath", funcPath);
      console.log("fileExists", fileExists);

      // Run the file, gotta pass in the request and get back the result
      // node -e 'require("./db").init()'
      //`npx babel-node -e 'const func = require("${funcPath}"); func.default(${request});`,
      child_process.execSync(
        `npx babel-node -e 'import func from "./${funcPath}"; func();'`,
        (err, stdout, stderr) => {
          if (err) {
            console.error("e", err);
            return;
          }
          console.log("stdout", stdout);
        }
      );

      return {
        statusCode: 200,
        status: "OK",
        message: `${request.params.end}`,
      };
    },
  },
];

// loadDynamicRoutes();

export default routes;
