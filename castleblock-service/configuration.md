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
    (default: `S+09wqOMBg6FTgZfHmZdegekrmaejMeas7lBfzbyt3WS2FqDA50HP6aGmljubkWD+wo1SP1RkFJnq7lk9gEu9A/EQW8A2hVYQtfkz2q3PHAyATd4Zxpfg7EnhKHDCe0TsubA4ZkAMgzIckYT7A8xRgbU7DsFILml2DlARpPV7FVo6b/3oTyhzl+jEJ4jwQEoeNkxjaaUhabjf1QWtjj9535qBaq2gSue3V+D9vvefBqSYJGwSBpbnPoKCGX962DVEXEZegpvFkV8DFs5wNzJgRDm23/zcdjdu8zLX6BS87uVQ8R8IOMb+2kGIi17rKgECbpoCo6cYkOmg0MbWzlb1g==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `edwHWlGW0+I9/g9Qc82LvwlZWRCAMEeVG2prDjU5`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
