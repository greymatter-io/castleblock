# castleblock-service

A mircofrontend service that hosts SPAs and Microfrontends in a uniform way designed to encourage reuse and full versioning of deployments.

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
npm run build
castleblock-cli -n homepage -d ./public
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
