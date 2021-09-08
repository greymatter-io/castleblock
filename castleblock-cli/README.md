# castleblock-cli

The castleblock-cli interfaces with the castleblock-service API and deploys apps via a command line interface.

## Usage

```
$ castleblock --help
Welcome to the castleblock cli
INFO: Type --help for list of parameters
Usage:
  castleblock [OPTIONS] [ARGS]

Options:
  -d, --directory FILE   Directory containing the built assets
  -n, --name STRING      Name of deployment
  -u, --url [STRING]     URL to castleblock service (Default is http://localhost:3000)
  -v, --version STRING   Increment Version
  -e, --env FILE         Include env file in deployment (accessible from
                         ./env.json when deployed)
  -w, --watch DIRECTORY  Watch the current directory, then build and deploy
                         when a file changes.
  -b, --build STRING     Build command that is run before deployment
  -r, --remove           Remove deployment
  -h, --help             Display help and usage details
```
