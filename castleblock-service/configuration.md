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
    (default: `EDcSU/IAX9FcFiqcNisUcwKPsRa3NkG36D1EpP/89zB9ML7mr1HhN9w08mph5Zrl8C+ccx3ipUIZUrEjqbkcxglA5CSpRpKXJPWDzPblvP5ScrHDy4s491aU8RLuB9Rnp+4HA2Dvin1iTVsUVKjUxHojcG/fVrzPa0QdrJB3nfkDp324lIQX3HOD3OsUXAHElj3bWssrcwH1YPY1KI3IrUh38VmBsaAkEFUjaOVU0aL0E+xLF+JGrJy5j+AfQN87v+UsgZn1dXkuPVa2RTxoEE2y9VWq4BM6Gs03am6YkQvPI+wp0J4dixcn/Odeeg0EPQ+etGPO4MunlfernLEHBA==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `QMj6sVNd7s2qtq9SF4h8bFbD4MdU6YBzmZ5K0nP8`)
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
