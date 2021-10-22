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
    (default: `aYfFrlvzERJ4b4x8sGxlNubbYZng6fWCrt9rVzBZT3zkcPAevVktSsUgxnfBaGmEp9oMLafAfHYHOFO0i7tTMc1EW7TyO9Y3R/7bWnTZ5kJRUdUMY+dxEJZ0kUKRWyC3VyE0XXoJK5UCxsvzhJgjRxH7Vi6wYoDjobJthuVkvVow3j8mIf3JCgNCegd0/cEKkb9iMbo99K81/iUl+Hhq2A9HsXrf9fTfhLmf94MW2g+oJdTYTkcSC+dFFhi698L913LKcs54ek0+MlvDbdZf8poi3IOrUtMKp4tiXA4DvOkrqbO+vUg5XCojNcHxryKErPa87E8mlZO0AnoNpyK/uQ==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `Sfe2DNTV5MUyBdfSNj2o7DTuFbEvALA0uCXfvgjO`)
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
