import Bell from "@hapi/bell";
import Jwt from "@hapi/jwt";

import settings from "./settings.js";

const admins = settings.initialAdmins;

export default async function setupAuth(server) {
  if (settings.jwt) {
    if (settings.oauth) {
      await server.register(Bell);
      server.auth.strategy("main", "bell", settings.oauth);
    }

    await server.register(Jwt);
    server.auth.strategy("jwt", "jwt", {
      keys: {
        key: settings.jwt.secret,
        algorithms: ["HS256", "HS512"],
        kid: "castleblock",
      },
      verify: {
        aud: "urn:audience:castleblock-developers",
        iss: "urn:issuer:castleblock-service",
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: settings.jwt.maxAgeSec,
        timeSkewSec: settings.jwt.timeSkewSec,
      },
      validate: false,
    });

    server.route({
      method: ["GET", "POST"], // Must handle both GET and POST
      path: "/token", // The callback endpoint registered with the provider
      options: {
        description: "OAuth authentication and JWT deploymnet token generation",
        notes: "Returns deployment token",
        tags: ["api"],
        auth: settings.oauth
          ? {
              mode: "try",
              strategy: "main",
            }
          : null,
        handler: function (request, h) {
          if (request.auth.strategy && !request.auth.isAuthenticated) {
            return `Authentication failed due to: ${request.auth.error.message}`;
          }
          if (request.auth.strategy) {
            const username = request.auth.credentials.profile.username;
            if (admins.includes(username)) {
              const newToken = Jwt.token.generate(
                {
                  aud: "urn:audience:castleblock-developers",
                  iss: "urn:issuer:castleblock-service",
                  username: username,
                },
                settings.jwt.secret
              );
              return `<html><head><title>Castleblock Token</title></head><body><div><h3>Castleblock Token</h3>
              <textarea id="token" style="width:300px; height:150px;" readonly>castleblock login -u ${
                settings.protocol
              }://${settings.host}${
                settings.port ? ":" + settings.port : ""
              } -t ${newToken}</textarea>
              <div><button>copy</button></div>
              </div>
              <script>document.querySelector("button").onclick = function(){document.querySelector("textarea").select();document.execCommand('copy');}</script></body></html>`;
            } else {
              return `Authorization failed. ${username} is not an admin.`;
            }
          } else {
            return "Not issuing tokens at this time. Ask your administrator for a castleblock token.";
          }
          return h.redirect("/");
        },
      },
    });
  }
}
