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
    (default: `onoNUPlWASztzhM59+1jxSoBfhiaJPRWLU4KCF4opW4b2xXZ4/7MRPwdLQZnIqCekJIqxuIAnNcyxJYrzhr+EBENPBcWACoRu6rGAq8v5e6VK5HyqkbSSAw5YwpU+1Ct2NCpLT2nhuVnsNNvXBbejquS3fXhH9tSnliuvoMACdlcoqk82xHeK9vx7rvgt48mpo+2GdUY23qdHY8Zvk7EHPoSqQ3YYiOHqVKk6VnoROOSAgNedpg+dZ4BE+msbTYr5eNfNUe5cBOUUHYDTOOqFAY0RL7tkQX4/wcjBlt6g/wJyuFzTV2Bh/3FiHR8tDxDuUbd1ek+CIVYp7leG/3xOw==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `7bIeP6E7KO7XrRy5V+iO3HiijRs1n/gzvkc6AE/1`)
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
