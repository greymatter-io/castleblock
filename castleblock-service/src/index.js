"use strict";
import Hapi from "@hapi/hapi";
import setupPlugins from "./plugins.js";
import settings from "./settings.js";
import routes from "./routes.js";
import setupAuth from "./authentication.js";

const init = async () => {
  const server = Hapi.server({
    port: settings.port,
    host: settings.host,
  });

  await setupAuth(server);
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
