"use strict";
import Vision from "@hapi/vision";
import Wreck from "@hapi/wreck";
import Inert from "@hapi/inert";
import H2o2 from "@hapi/h2o2";
import Basic from "@hapi/basic";
import susie from "susie";
import HapiSwagger from "hapi-swagger";
import Status from "hapijs-status-monitor";
import _ from "lodash";

import utils from "./utils.js";
import settings from "./settings.js";
export default async function setupPlugins(server) {
  await server.register([Inert, H2o2, Vision, susie]);

  if (settings.swaggerDocsEnable) {
    await server.register([
      {
        plugin: HapiSwagger,
        options: {
          documentationPath: "/api",
          info: {
            title: "CastleBlock API",
            version: "0.0.1",
            description: "CastleBlock is a Web Hosting as a Service platform.",
          },
          grouping: "tags",
        },
      },
    ]);
  }
  if (settings.statusMonitorEnable) {
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
  if (_.get(settings, "proxy.enabled")) {
    //Allow proxying to other services

    //Generate routes

    settings.proxy.routes.forEach((route) => {
      console.log("route", route);
      server.route({
        method: route.method,
        path: `/services/${route.name}/${route.version}/{end*}`,
        options: {
          description: route.description
            ? route.description
            : `Reverse Proxy to ${route.name} microservice`,
          tags: ["api", "services"],
        },
        handler: {
          proxy: {
            mapUri: function (request) {
              return {
                uri: `${route.target}/${request.params.end}`,
              };
            },

            onResponse: async function (err, res, request, h, settings, ttl) {
              console.log("path", request.path);
              if (
                request.path === `/services/${route.name}/${route.version}/`
              ) {
                const stream = await Wreck.read(res);
                return utils.injectBasePath(
                  stream.toString().replaceAll(`"/`, `"./`),
                  `.`
                );
              } else {
                return res;
              }
            },
            acceptEncoding: false,
            passThrough: true,
            xforward: true,
          },
        },
      });
    });
  }

  return server;
}
