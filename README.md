<img src="./assets/brand/Logo.png" height="80px" />

CastleBlock a UI development and deployment platform. Deploy multiple web apps into the same environment and share web-components between them. Use the CLI to deploy any web app directly into production, or ad hoc deploymenets with hot-reloading. Deploy multiple versions of the same application or web-component.

CastleBlock is Web Hosting as a Service with a CLI and Apps/WebComponent Catalog for discovery of deployed applications, microfrontends, and web components.

![diagram of castleblock high level concept](./castleblock-concept.png "Castleblock high-level concept")

## Features:

- [Web Component delievery](./#sharing-web-components) to downstream web applications
- [CLI](./castleblock-cli) for manual deployments or continuous delivery
- Deployment versioning using [Semantic Versioning](https://semver.org/)
- [Environmental Variable Injection](./castleblock-cli#environmental-variable-injection)
- [Ad hoc deployments](./castleblock-cli#ad-hoc-deployments)
- Dynamic Swagger Documentation (http://localhost:3000/documentation)
- [manifest.json](./castleblock-cli#manifest.json) files are used to display app information in the CastleBlock UI.
- [OAuth](https://github.com/greymatter-io/castleblock/tree/master/castleblock-service#authentication) support for many oauth [providers](https://hapi.dev/module/bell/providers) for user authentication.
- [JWT](https://github.com/greymatter-io/castleblock/tree/master/castleblock-service#issuing-jwt-tokens) for authorization.
- [CastleBlock UI](./castleblock-ui) for browsing deployed Apps, Microfrontends, and SPAs
- [Reverse Proxy](./castleblock-service#reverse-proxy) for microservices in your environment
- [TLS Support](./castleblock-service#tls)

## Quick Start

- Bundle your project
- Run [castleblock-service](./castleblock-service) or use an existing instance.
- Deploy your project with [castleblock-cli](./castleblock-cli)

```
castleblock deploy
```

![diagram of how to use castleblock](./castleblock-usage-diagram.png "Castleblock usage diagram")

## Sharing Web Components

CastleBlock lets you deploy webcomponents that can then be integrated into your web applications. Rather than transpiling the web-component directly into each web application you can deploy the individual web components and load them at runtime. This allows the web-componetns to be developed and redeployed indepentantly of your web applications.

![diagram of shared web-components](./web-components.png "Castleblock web component sharing")

### Example Svelte Web Component

Making really small light weight web compoennts in Svelte is easy, just define the tag at the top of your component. For an full example see [simple-clock](https://github.com/jmcudd/simple-clock).

```svelte
<svelte:options tag="simple-clock" />

<script>
  import { onMount } from "svelte";
  export let size = 15;
  let now = new Date();
  let out = `00:00:00`;
  function dd(num) {
    return num < 10 ? `0${num}` : num;
  }
  onMount(() => {
    setInterval(function () {
      now = new Date();
      out = `${dd(now.getHours())}:\
            ${dd(now.getMinutes())}:\
            ${dd(now.getSeconds())}`;
    }, 500);
  });
</script>

<div style="font-size:{size}px;">{out}</div>
```

### Integrating Web Components

Just include the bundled web componet in the index.html file of your web application and then you can use the tag anywhere in your web app. Then at load-time, the latest version of the webcomponetn will be loaded. There is no need to rebuild the downstream app anytime the webcomponet gets updated.

```html
<html>
  <head>
    <title>Web App A</title>
    <script src="https://castleblock.io/ui/simple-clock/latest/simple-clock.js"></script>
  </head>
  <body>
    <simple-clock></simple-clock>
  </body>
</html>
```

## Development Environment

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell` in the root of the project.

## Contribute

Check out the backlog of [planned features](https://github.com/greymatter-io/castleblock/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), PRs are welcome.
