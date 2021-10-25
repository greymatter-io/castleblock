# Castleblock castleblock.json

- **`debug`** (type: boolean) : Outputs debug logs to stdout

- **`protocol`** (type: string)
  (default: `http`)
- **`host`** (type: string)
  (default: `localhost`)
- **`port`** (type: number)
  (default: `3000`)
- **`tls`** (type: object)

  - **`key`** (type: any)

  - **`cert`** (type: string)

- **`statusMonitorEnable`** (type: boolean) : Enables status monitor page at /status
  (default: `true`)
- **`swaggerDocsEnable`** (type: boolean) : Enables swagger API documentation page at /documentation
  (default: `true`)
- **`assetPath`** (type: string) : Directory path where the webapp assets are stored on disk.
  (default: `./assets`)
- **`homepage`** (type: string) : The app that should be displayed as the landing page for the service.
  (default: `castleblock-ui`)
- **`basePath`** (type: string) : URL basepath where all apps are hosted under
  (default: `ui`)
- **`jwt`** (type: object)

  - **`secret`** (type: string) : HS256 or HS512 Secret Key. Default is randomly generated.
    (default: `RUnRYHxGV0H2HFqOlQqdxS3XR8fRV6cmYIuoN37m4EV5tVIfWcjVE8zNYKQ4Iv+4wJfN1yKM1aEGh6Y8l6DRMGnOihd9ZXhFtqwud6S5h+LCYo9hTzi+iDxJt3GTD5og6CxOzw3JOPOpXHe8FAZniaFA30I7LyzA9CRgYd+dJDp33xQFDUOboWH5qNY6Psk2Hq8ZPwJmWXAPP3k9du7Cu4BHsRqNPdLg+4+SRrkwOVcNntMfm3IJJuovloLXxrTr9b6ub6XePrFvJsWerUSpNRi3CRXDG3o1ALvIhfQvj1YlXqSAF2SoCEXHZwZWMsnDxVOhJUzmo0H2E9cK/YklwA==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `XCjXz8GnJ8rHnrY1PgOYhBeysXove6Gf43OTyQvf`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)

- **`proxy`** (type: object)

  - **`enabled`** (type: boolean)
    (default: `true`)
  - **`routes`** (type: array)
    (default: `[]`)

    - **`name`** (type: string)

    - **`version`** (type: string)

    - **`target`** (type: string)

    - **`method`** (type: alternatives)
      (default: `*`)
    - **`description`** (type: string)
