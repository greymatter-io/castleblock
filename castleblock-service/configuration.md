# Castleblock castleblock.json

- **`debug`** (type: boolean) : Outputs debug logs to stdout

- **`protocol`** (type: string)
  (default: `http`)
- **`host`** (type: string)
  (default: `localhost`)
- **`port`** (type: number)
  (default: `3000`)
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
    (default: `dr/+sTHzf8bUiL3yNwzlOYNK83FQDXfUKj3HZ6/ydjlQw1nUXLm7IofseGQaOYmOMM53uP27VlXoZpZQi56c/bcVTuwG//K3A5brve2ctrV2MC/oeYzFuoXjeHat8o1JFrmOToFqxVJv9rL8BJrXrhfiKR7SHDr56SKro9w1rfqqGuEM8F/9U1sDOVUAIVkuZ0BfQeXX9sflRtH2QmZdjxPrG4S9NvS/lvWPnQUh48flDVzHcmoLqNmmEjvnXYhS3ajjZ9/d9yrLzMiBw1dDxE9p3ClbMuLvLjHLarukVq20b1Vve177qfYC/SFoG+vPXH5ytDlV7+YIh4S+1IAZZw==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `ZlyUb0xdIcR64ObIywrKOEacWZYKjTEkcjwr2V4G`)
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
