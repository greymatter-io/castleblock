# castleblock-service

A webhosting service that hosts web aps in a uniform way designed to encourage reuse and versioning of deployments.

## Getting Started

```
npm install
npm run dev
```

## Configuration

To override the default configuration, a json file can be created. See the [schema](./configuration.md) for more information.

### Loading the Configuration

To load a configuration run `npm run dev -- --config <path-to-config>`. You can run castleblock with no configuration file and it will just use the default values.

## TLS

See the tls section in the [configuration](./configuration.md). Generate self-signed certs by running `npm run genSelfSignedCerts`.

## Authentication

Castleblock uses oauth providers for authentication. See the [@hapi/bell providers](https://hapi.dev/module/bell/providers) for details on how to configure the `auth` section of the [castleblock.json](./configuration.md) file.

## Issuing JWT Tokens

With oauth enabled, the http://localhost:3000/token will issue users a JWT token. If their username is in the `initialAdmins` list they will be able to deploy with their token.

With oauth disabled, the http://localhost:3000/token endpoint will not issue users a JWT token. Instead tokens must be created and issued with the same secret key.

### JWT Token Generation (if oauth is disabled)

If in posession of the JWT secret key, the user can run `castleblock login -j <jwt-secret>` and generate a token on the fly.

### JWT Secret Generation

By default the service will generate a secret automatically, but you can generate your own by running `npm run jwtSecret`.

## Install a homepage

The homepage is the application you would like to be hosted at http://localhost:3000/. This could be a landing page or some sort of portal to other applications on your platform. Castleblock comes with a castleblock-ui that you can install at the homepage for now, if you don't have your own custom app. To install it, follow the instructions below.

```bash
cd ../castleblock-ui
castleblock deploy -d ./public
```

Now when you go to the castleblock-service at http://localhost:3000/ the castleblock-ui will be displayed. It will list all the deployed apps and versions available. This is useful for developers looking to leverage existing applications as microfrontends or webcomponents.

## Reverse Proxy

Applications can access microservices and eternal origins that are whitelisted.

```
fetch("/proxy/http://coolservice.com")
```

## Build docker image

```
npm run build
```

## Run docker image

```
npm run docker
```

## Dev Environment

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell` in the root of the project.
