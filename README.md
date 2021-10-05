<img src="./assets/brand/Logo.png" height="80px" />

CastleBlock is Web Hosting as a Service with a CLI and Apps Catalog for discovery of deployed applications, microfrontend, and web components.

![diagram of castleblock high level concept](./castleblock-concept.png "Castleblock high-level concept")

## Features:

- CLI for manual deployments or continuous delivery
- Deployment versioning using [Semantic Versioning](https://semver.org/)
- [Environmental Variable Injection](./castleblock-cli/README.md#environmental-variable-injection)
- Reverse Proxy for CORS support
- [ADHOC deployments](./castleblock-cli/README.md#watch-and-deploy)
- Dynamic Swagger Documentation (http://localhost:3000/documentation)
- [manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) files are used to display app information in the CastleBlock UI.
- Deploy Single Page Apps, Microfrontends, Web Components, any Web Asset
- [CastleBlock UI](./castleblock-ui) for browsing deployed Apps, Microfrontends, and SPAs
- Reverse Proxy for microservices in your environment

## Quick Start

- Bundle your project
- Run [castleblock-service](./castleblock-service)
- Deploy your project with [castleblock-cli](./castleblock-cli)

```
castleblock deploy
```

![diagram of how to use castleblock](./castleblock-usage-diagram.png "Castleblock usage diagram")

## Development Environment

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell` in the root of the project.

## Contribute

Check out the backlog of [planned features](https://github.com/greymatter-io/castleblock/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement), PRs are welcome.
