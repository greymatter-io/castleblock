# castleblock-cli

The castleblock-cli interfaces with the castleblock-service API and deploys apps via a command line interface.

## CLI Usage

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

- [short_name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/short_name) - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`
- [version](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version) - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`. The version must follow the [semver standard](https://semver.org/)
- [name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/name) - Used in castleblock-ui app cards
- [description](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/description) - Used in castleblock-ui
- [icons](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons)

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

## ADHOC Deployments

The watch command allows you to deploy an adhoc version of your application to a randomly generated URL. Castleblock will watch your files for changes, rebuild, and deploy anytime you make a change. This allows you to share or demo a feature currently in development and test it directly against your microservices in your deployment environment..

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

## Environmental Variable Injection

Sometimes your application needs to be configurable after it has already been bundled. CastleBlock provides a mechanism to include an additional json file alongside your bundled application.
e the `--env` option to include configurations at runtime.

```
castleblock deploy --env env.json
```

This will inject the env.json file into your deployment, so your application can `fetch(./env.json)` to load custom configuration values when the application first loads.
