"use strict";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import H2o2 from "@hapi/h2o2";
import Basic from "@hapi/basic";
import susie from "susie";
import HapiSwagger from "hapi-swagger";
import Status from "hapijs-status-monitor";

import utils from "./utils.js";
import settings from "./settings.js";
export default async function setupPlugins(server) {
  await server.register([Inert, H2o2, Vision, susie]);

  if (settings.swaggerDocsEnable) {
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
  if (settings.corsProxyEnable) {
    //Allow proxying to other services
    server.route({
      method: "*",
      path: `/proxy/{url*}`,
      options: {
        validate: {
          params: async (value, options, next) => {
            const url = new URL(value.url);
            if (settings.originWhitelist.includes(url.origin)) {
              return value;
            } else {
              throw Boom.badRequest(
                `${url.origin} is not a whitelisted service. Contact your administrator.`
              );
            }
          },
        },

        description: "CORS Proxy",
        notes: `Make requests to other origins. The current whitelist includes the following origins: ${settings.originWhitelist.join(
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
  }

  return server;
}
