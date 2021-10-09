"use strict";
import Hapi from "@hapi/hapi";

import setupPlugins from "./plugins.js";
import settings from "./settings.js";
import routes from "./routes.js";

const init = async () => {
  console.log("Origins:", settings.originWhitelist);
  const server = Hapi.server({
    port: settings.port,
    host: settings.host,
  });

  await setupPlugins(server);

  routes.forEach((route) => {
    server.route(route);
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
