import Bell from "@hapi/bell";
import Jwt from "@hapi/jwt";

import settings from "./settings.js";

const admins = ["john.m.cudd"];

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
        auth: {
          mode: "try",
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
            console.log(`username: ${username} jwt:, ${newToken}`);
            return newToken;
          } else {
            return `Authorization failed. ${username} is not an admin.`;
          }
          return h.redirect("/");
        },
      },
    });
  }
}
