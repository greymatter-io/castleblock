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
    (default: `EGPeZS0bBQgie0dh7mCtdCgylwD4fzjCQdg0TGfJ6nrcfHdT/K9YB5rV1Po6kV+y5R2nKPWLN4DN60QUxwk2cRbNn9G9n1t38hGltWGR5lz9nld50cbBHMWeRCxtaarbb2CpWJSgiS/R4OFNXCKU48EjeSl5gnaOZFwBjnnecOXTZHen8KwrF0bDan86UPBML3OMMI1XKVDn2xkVvBNdjypDNNtcCsF4KVPq3bD4U15BQUBKlJBBGqR8fhFzjCky4ylgnnvdmqPcH1+ucy7eexGvHcWgJtpD6VnbNQjhv8V+qeEfyr7DPEnW54ZCbW2Co8FcpVQpZOH+zsMWz2f+pg==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `Cu1jRoo43oGAWxIZNmvJrLTXhCubU0ah9korF+LQ`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array)
  (default: `[]`)
