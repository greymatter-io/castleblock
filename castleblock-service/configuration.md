# Castleblock castleblock.json

- **`debug`** (type: boolean) : Outputs debug logs to stdout

- **`protocol`** (type: string)
  (default: `http`)
- **`host`** (type: string)
  (default: `localhost`)
- **`port`** (type: number)
  (default: `3000`)
- **`corsProxyEnable`** (type: boolean)
  (default: `true`)
- **`originWhitelist`** (type: array)
  (default: `[]`)

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
    (default: `jgOeho7DnR5Pl8I4h0EjMEOHYneh3WCrbDusS7LWftLtD4DOtObBtkuwLFJ9ONm8+XrbGURpDK5n/k3pijcSyNV/vP7o58BGoGrediP+5EkDy/hJ1wHZudWluDG8up4fvT7f55HalO2L/+2/v6uSbabYUSJEdPEqvQEBuZHHo8r/VA0kiR7LOwtYYAokcGAKIUqXT6GAcVWGKVcX/7kyN1pejbL044evOX9PgZm0aaqC3LLdwnnwJSLgdr3ZtWus9b+eCkGWjL98C+hrGu2pQ1aeRU8murPAYRnYrAvomHMAUFLlIB9QhBB5E73xOGkA8PWe3rNy5xB7Kq9MMYLVGw==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `BQTVnJ7KLDdQ2rmRqtLP3/QRTQ0XAfBAagPWuM8T`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
