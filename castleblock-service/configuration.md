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

  - **`secret`** (type: string) : HS256 or HS512 Secret Key.
    (default: `H/3Ij/wArBL7mV+n4hkbf5pdGib2eV3BbtNglIzcXo/SscnJOYcWs9AyOX5GxWdcd+N/ZLg96d3D9XPrB6BpoSYyuhdtQmq8DwnPok+7CwfHVfay1oKTX5AiWci2vkUoNvma6R1z0eWD5Bt1/UJ2CMKnBSJDikJQIJ8yVSvdlSIFcOc1RiQaNRr7Gl8jnRHNDopwgD34eeP8cGO95/+SEE+PsVzyw9UhIHLhM59cSGZd6s4GPDujIXsgCwetyTFj1DZ5ibU8AupYRPyCVv8cbrQfVbzW6KRK5AMp7GprKRdkOZt1dtlzV09MEz/3lixEPOGgnMcevwPdwXU2f9bkLA==`)
    **notes:** \* Default is randomly generated.

  - **`maxAgeSec`** (type: number)
    (default: `14400`)
  - **`timeSkewSec`** (type: number)
    (default: `15`)

- **`oauth`** (type: object) : OAuth Authentication settings. See the [@hapi/bell](https://hapi.dev/module/bell/api?v=12.3.0#options) documentation for oauth provider specific options

  - **`provider`** (type: string)

  - **`password`** (type: string) : The cookie encryption password. Used to encrypt the temporary state cookie used by the module in between the authorization protocol steps.
    (default: `PRIEv82wj35glDJTZicVqyKCSSrAWnHYnP/QYedI`)
  - **`clientId`** (type: string) : the OAuth client identifier (consumer key).

  - **`clientSecret`** (type: string) : the OAuth client secret (consumer secret).

  - **`isSecure`** (type: boolean)

  - **`scope`** (type: array)

  **notes:**

  - Expects a bell auth strategy object.
  - See here for details. https://hapi.dev/module/bell/api?v=12.3.0#options

- **`initialAdmins`** (type: array) : List of usernames
  (default: `[]`)
