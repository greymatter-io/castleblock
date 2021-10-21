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
    (default: `okVM+tyvaaLQFeYd0vVXgR0npyifFOtYpaat8g8DflkSW65J7VAM0gWmEndm8SI3urIYp5k2SWa9oXUjCTt6Q19UeFPrFudIikvO+liZZ3tHYGZcRJDy8GqCH8iHFSdh6MFaec9zcbcA+fl1ha/WpfB6BIqpcDmG6nklSP9wSmMFirK2hNxAyCM2bSdpoRv4DN3wh5IlagMN8c7KlZMxL9chFZi8WOi2F8uSPrQkuPRfVNlS76dZMHpxwWTrcGLYat+a8iBEemYmgYLhC4BMWT2HzBG/tH0xDjTXbxtZUQWZmkk4zZETYgWUkNLIuk5TVGuOcfafcuQQmizh4ZTzWg==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `0tAbSs9IAUNDeVu0nAPCDxfYqA9INWze4LvvAKNt`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array)
  (default: `[]`)
