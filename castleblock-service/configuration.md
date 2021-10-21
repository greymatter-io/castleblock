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
    (default: `wsbt6qjZ/ptyg4ylus2W1v07DWoq5DnfwYMmcqdkVF/60XN4fJsaxDyxQjn8zwEfiQ30Gd2QuWV+sGd3bdx4sanlpsR7dmHbZoNV+ym4laS2kKhkw43yl6Pt3eNJ0DFyiMMNwPagEsFAI6YXNhFxJJS7c8rKOYiVPPvRJ0LYJGhitv+6+7yTPK5Embka3/1rtOAR9OJAKhAQ0mGsGSKkYTYx5IkQdLi3II82msonSXyON8/8kul8EtMBuwWLzyywP2TVyVjGn0m9qjEpwCh7gpXGArtERON6Ul5/oBrNJ85ps1sM9waqMTYVU3kyslIP4Z+t0csc73/AZDkfsA8XQw==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `jJ1P1qC8XpitaBKRSrAhdZE9ckvldlRziCpGr+Nr`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
