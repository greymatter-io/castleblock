# castleblock-service

A webhosting service that hosts web aps in a uniform way designed to encourage reuse and full versioning of deployments.

## Dev Environment

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell` in the root of the project.

### Getting Started

```
npm install
npm run dev
```

### Install a homepage

The homepage is the application you would like to be hosted at http://localhost:3000/. This could be a landing page or some sort of portal to other applications on your platform. Castleblock comes with a castleblock-ui that you can install at the homepage for now, if you don't have your own custom app. To install it, follow the instructions below.

```bash
cd ../castleblock-ui
castleblock deploy -d ./public
```

Now when you go to the castleblock-service at http://localhost:3000/ the castleblock-ui will be displayed. It will list all the deployed apps and versions available. This is useful for developers looking to leverage existing applications as microfrontends or webcomponents.

### Build docker image

```
npm run build
```

### Run docker image

```
npm run docker
```

### castleblock-service Environmental Variables

| Variable              | Purpose                                                       | Default Value  | Example Usage                                      |
| --------------------- | ------------------------------------------------------------- | -------------- | -------------------------------------------------- |
| PORT                  | Port of service                                               | 3000           |                                                    |
| HOST                  | Hostname of service                                           | localhost      |                                                    |
| CORS_PROXY_ENABLE     | Enables the Reverse Proxy                                     | true           |                                                    |
| ORIGIN_WHITELIST      | List of origins that clients are allowed to proxy to.         | []             | ["https://google.com", "https://reddit.com"]       |
| STATUS_MONITOR_ENABLE | Enables status monitor page for the service                   | true           | <castleblock-service.url>/status                   |
| SWAGGER_DOCS_ENABLE   | Enable swagger documentation                                  | true           | <castleblock-service.url>/documentation            |
| ASSET_PATH            | Directory on disk that the deployments will be stored         | "./assets"     |                                                    |
| BASE_PATH             | URL basePath for hosted web apps.                             | "ui"           | <castleblock-service.url>/<basePath>/my-app/2.3.4/ |
| HOMEPAGE              | App that is displayed when you go to the root of the service. | castleblock-ui |                                                    |
