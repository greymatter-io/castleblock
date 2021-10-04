# castleblock-cli

The castleblock-cli interfaces with the castleblock-service API and deploys apps via a command line interface.

## Usage

```
$ castleblock --help
Usage:
  castleblock [OPTIONS] <command> [ARGS]

Options:
  -d, --dist [FILE]      Directory containing the built assets (Default is ./build)
  -u, --url [STRING]     URL to castleblock service (Default is http://localhost:3000)
  -e, --env FILE         Include env file in deployment (accessible from
                         ./env.json when deployed)
  -b, --build [STRING]   Build command that is run before deployment (Default is npm run build)
  -s, --src [FILE]       Source directory to watch for changes (Default is ./src)
      --deployURL STRING Deployment URL to be removed
  -p, --package [STRING] Name of tar.gz file (Default is deployment.tar.gz)
  -h, --help             Display help and usage details

Commands:
  deploy, remove, watch
```

## Manifest.json

Castleblock relies on your app's [manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) file to deploy your app.

- `short_name` - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`
- `version` - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`
- `name` - Used in castleblock-ui
- `description` - Used in castleblock-ui

## Deploying an app

```
$ castleblock deploy -d ./dist
INFO: Building Project: npm run build
INFO: Compressing public/ into deployment.tar.gz
INFO: Uploading deployment.tar.gz
INFO: SHA512:
      4585948608622f9399389f651b5f14b1c286a3418fb6da0f24b2137ebb81092bd4542b9e959ee8f9ba3b4532ee11dd569b721bfdb269f3f70bfe82efe9e540f5
INFO: URL: http://localhost:3000/ui/my-app/1.2.3
```

## Removing an app

```
$ castleblock remove --deployURL http://localhost:3000/ui/my-app/1.2.3/
```

## Watch and Deploy

```
$ castleblock watch -s ./src -b "npm run build" -d ./dist
INFO: Watching For Changes
      Source Directory: "./src"
      Build Command: "npm run build"
INFO: Building Project: npm run build
INFO: Compressing public/ into deployment.tar.gz
INFO: Uploading deployment.tar.gz
INFO: SHA512:
      4e8038713d624b43c4a137f5305a53a3abf90758c7a8cabedb8bf8a4ff8b4ca136c140193c742581c4392a1358b9e158e2a594ac8e3c391ec57de83febce82ad
INFO: URL: http://localhost:3000/ui/my-app/few-rhythmic-spring

```
