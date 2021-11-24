<img src="./assets/brand/Logo.png" height="80px" />

CastleBlock provides a deployment workflow for shared web-components/microfrontends so they can consumed by downstream web applications.

This is best demonstrated with an example.

CastleBlock is Web Hosting as a Service with a CLI and Apps Catalog for discovery of deployed applications, microfrontend, and web components.

![diagram of castleblock high level concept](./castleblock-concept.png "Castleblock high-level concept")

## Features:

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

## Development Environment

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell` in the root of the project.

## Contribute

Check out the backlog of [planned features](https://github.com/greymatter-io/castleblock/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), PRs are welcome.

```html
<html>
  <head>
    <title>Web App A</title>
    <script src="https://castleblock.io/wc/simple-clock/latest/"></script>
  </head>
  <body>
    <simple-clock></simple-clock>
  </body>
</html>
```

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
