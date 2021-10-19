import Bell from "@hapi/bell";
import Jwt from "@hapi/jwt";

import settings from "./settings.js";

const admins = settings.initialAdmins;

export default async function setupAuth(server) {
  if (settings.authStrategy) {
    await server.register(Bell);
    await server.register(Jwt);

    server.auth.strategy("main", "bell", settings.authStrategy);
    server.auth.strategy("jwt", "jwt", {
      keys: {
        key: settings.jwtSecret,
        algorithms: ["HS256", "HS512"],
        kid: "castleblock",
      },
      verify: {
        aud: "urn:audience:castleblock",
        iss: "urn:issuer:castleblock",
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400, // 4 hours
        timeSkewSec: 15,
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
        auth: {
          mode: "required",
          strategy: "main",
        },
        handler: function (request, h) {
          if (!request.auth.isAuthenticated) {
            return `Authentication failed due to: ${request.auth.error.message}`;
          }
          console.log(request.auth);
          const username = request.auth.credentials.profile.username;
          if (admins.includes(username)) {
            const newToken = Jwt.token.generate(
              {
                aud: "urn:audience:castleblock",
                iss: "urn:issuer:castleblock",
              },
              settings.jwtSecret
            );
            return `<div><h3>Castleblock Token</h3><textarea id="token" style="width:300px; height:150px;" readonly>${newToken}</textarea><div><button>copy</button></div></div><script>document.querySelector("button").onclick = function(){document.querySelector("textarea").select();document.execCommand('copy');}</script>`;
          } else {
            return `Authorization failed. ${username} is not an admin.`;
          }
          return h.redirect("/");
        },
      },
    });
  }
}
