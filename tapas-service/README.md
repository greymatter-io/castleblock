# tapas-service

A mircofrontend service that hosts SPAs and Microfrontends in a uniform way designed to encourage reuse and full versioning of deployments.

## End User Experience

tapas-service comes with a CLI program to make deploying a UI as simple as `tapas-cli -n my-app -d ./build`.

```bash
$ tapas-cli --help
Welcome to the tapas-cli
INFO: Type --help for list of parameters
Usage:
  tapas-cli [OPTIONS] [ARGS]

Options:
  -d, --directory FILE   Directory containing your built assets
  -n, --name STRING      Name of package
  -u, --url [STRING]     URL to mf service (Default is localhost:3000)
  -v, --version STRING   Increment Version
  -h, --help             Display help and usage details
```

## Dev Setup

Spin up the [nix](https://nixos.org/guides/install-nix.html) shell by running `nix-shell`

### Getting Started

```
npm install
npm run dev
```

### Build docker image

```
npm run build
```

### Run docker image

```
npm run docker
```
