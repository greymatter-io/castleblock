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

  - **`secret`** (type: string)
    (default: `rZnL45th3Cx9RYgomgtv66ZwHPzk/hIB/6KStxRpy67wmiekx5pwrgtB9bemYMsi24AnjAJUCC9pxTOlqY1RX13dKaxOxLuJfGjt9w4Ukbm0kBHTekgOD1anWVgDMTfgnvENNI0uya6K9JWdlph7ntkWgYFs/ZjGKfTOm0mYI3KO/s3us5z6WmMEcHwEQulC1tCsIC+sFj78mVo8TAXjnKKL0pH++7q6YwS/Nc0Y24SX3RYHPHFklCQFr3OnTRHF1+F8uEsA4iowYW1WqMVc2nXQcRjAE+IHKru7mOwCVqU5c2f8Mnt2tnlwxVkvhd9u2k7Y3HmFDpWrpLK/TORYBQ==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `7v/fkT+z9rnFFHoLBok47CwBpR91eJXr7budYynx`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array)
  (default: `[]`)
