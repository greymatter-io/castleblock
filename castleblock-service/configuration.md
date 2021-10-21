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
    (default: `WeAlNhEJXdZCrsCLf2PS2F788ZmT5bzhF7oTZpuhc0hTeQFC2jGk6duaiPezxiNqP387NMnHtP8W3Q2ORpuHY/A+yyZS9ZzqL0XhSBfi/nkB/+Ez9ji08E2xiejlYmbM4I4rWJiIWapPIauVCEYwnBDhJAs1gd6JitU+umQ3eFrRUqlqvCTjOX2Xtd6Yohl2Vfk3XdUKRTwxnP3CX3OsFF+Q8c3duwxbgyzfyhywKdcnJOgJ8C4kMaZf3CN0Fbz3T++Qu7cyJGlcrwb3DTHDtUCfwlrsKNoXvhdydC2C7Gi7vmDqxYA3D9+l/77NXdvI6bDPZbIMElPmmzntrYRpkQ==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `rP54XZjs7Bw1TnlPsmGc/KfZCJQOm7A4O9wfEZwv`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
