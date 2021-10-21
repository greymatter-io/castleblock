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
    (default: `aQ+cOFhxTT3vKlXpUhwDZq5MLFrkktmbUcLWL9gpCYsyhD2uHKe73wUtRekG/cTdeTWqEwEcI8mI53oVu1K2+CS3zy1auUlkQPr7nAfqcoIIvyY2ntno68Ug4ZlG0v+B7qqo0ZLfjlugHQeAmARHcvhvhqm7bj77HAqo9VhnKZ78ZAtLvCj5qZ6Du5v5ckAj9cxDN1iENdVQr9sfkTXNpzsKSGypBJ3Xb+IFlc7lffTwLsiYnJijHy8Iq+BL+aueo9m8ZtKVPSLPjMHjyPxzhDSBjXOWUs9Okb8FNNNg24Ct8+HAGv1Pj4PKG5rRvFkG4YUYNphOJPA4QSpYhqQIdA==`)
  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `XdtuV/BuJKeHgyLJGERQMdhGQ+lAXI4bPShTtd/6`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
