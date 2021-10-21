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
    (default: `m5fgRVFY8TcRNmAc0/XTpcBEa/2Ltd6dz1TZCxD8n2C9LPDbj4cw6uKLnqMlPW9PGCbpZebZ8sO1Bii3fQhtM8VRdfQpq3OshsNRsenVmnSkjGa6RGBqxo4gvXa0e1U1RKXLHVRvRS70QbzQpJT+uHkOtSeR7ndMr9ticRNUkpWquIuyJdgtZJIGJcnPjZXbNbUBFID5jrL3AChgAISY8TMzPDBKNtcojIQUX2xDd4cvtEdAnnRfdnmbDycg71vHjbhhciEzZw0mvIUo2gH4AY3JJIvmzwYPn08mMGr98eRaizBqC6lJcSGP5wN7wunwJ5J9w9ShzncBXFEi8I9QEg==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `ywZtjRFEi8nuuyXBlTVLQuWIAP0owK6T67Gg/whm`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array)
  (default: `[]`)
