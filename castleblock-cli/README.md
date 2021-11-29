# castleblock

The castleblock-cli interfaces with the castleblock-service API and deploys apps via a command line interface.

## CLI Usage

```
$ castleblock
Usage:
  castleblock [OPTIONS] <command> [ARGS]

Options:
  -d, --dist [FILE]      Directory containing the built assets (Default is ./build)
  -u, --url [STRING]     URL to castleblock service (Default is http://localhost:3000)
  -e, --env FILE         Include env file in deployment (accessible from
                         ./env.json when deployed)
  -b, --build [STRING]   Build command that is run before deployment (Default is npm run build)
  -s, --src [FILE]       Source directory to watch for changes (Default is ./src)
  -f, --file FILE        Deploy an existing package
  -p, --pack BOOL        Save deployment package to disk
  -t, --token STRING     Authorization Token
  -j, --jwtSecret STRING JWT Secret Key for generating a token on the fly
  -h, --help             Display help and usage details

Commands:
  deploy, login, remove, version, watch
```

## Manifest.json

Castleblock relies on your app's [manifest.json](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) file to deploy your app.

```json
{
  "[short_name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/short_name)": "my-app",  # (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`
  "[version](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version)": "1.2.5", # (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`. The version must follow the [semver standard](https://semver.org/)
  "[name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/name)": "My Application", #Used in castleblock-ui app cards
  "[description](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/description)": "A description of the application.", # Used in castleblock-ui
  "webcomponent": false, # Set to "true" if the deployment is a web component
  "[icons](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons)": [
    { "src": "./my-app-icon.png" }
  ]
}
```

- [short_name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/short_name) - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`
- [version](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version) - (required) Used in the url `<castleblock-service-url>/ui/<short_name>/<version>/`. The version must follow the [semver standard](https://semver.org/)
- [name](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/name) - Used in castleblock-ui app cards
- [description](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/description) - Used in castleblock-ui
- webcomponent - Set to "true" if the deployment is a web component
- [icons](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/icons)

## Deploying an app

First make sure you have the [service](../castleblock-service) running. In this example the service is running at http://localhost:3000

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
$ castleblock remove http://localhost:3000/ui/my-app/1.2.3/
```

## Ad hoc Deployments

The watch command allows you to deploy an adhoc version of your application to a randomly generated URL. Castleblock will watch your files for changes, rebuild, and deploy anytime you make a change. This allows you to share or demo a feature currently in development and test it directly against your microservices in your deployment environment..

```
$ castleblock watch -d public/
{
  dist: 'public/',
  url: 'http://localhost:3000',
  env: null,
  build: 'npm run build',
  src: './src',
  file: null,
  pack: false,
  token: null,
  jwtSecret: null
}
INFO: Watching For Changes
      Source Directory: "./src"
      Build Command: "npm run build"
INFO: Compressing public/
INFO: Building Project: npm run build

src/main.js → public/build/bundle.js...
created public/build/bundle.js in 429ms
INFO: SHA512:
      c2e2840f8a1c1b290c240ae5b15037eaf47807830862622a5d8292cc51db1c9ab51d088d33791c2414920b08303af93c81b4158d643377f7156470a21363c3fe
INFO: Uploading Package
INFO: URL: http://localhost:3000/ui/my-app/adhoc-vdzitr33w7g
```

## Environmental Variable Injection

Sometimes your application needs to be configurable after it has already been bundled. CastleBlock provides a mechanism to include an additional json file alongside your bundled application.
e the `--env` option to include configurations at runtime.

```
castleblock deploy --env mysettings.json
```

### Accessing env.json from your App

Castleblock will inject the env.json file into your deployment, so your application can `fetch(./env.json)` to load custom configuration values when the application first loads. The file is always `env.json`, regardless of what the original filename was.

## Default CLI Options

Castleblock allows you to save your own default options in a `.castleblock.json` file either in your home directory (globally) or in your project directory. Any of the CLI options can be set to alternative default values. See below for an example.

```
{
  "config": {
    "dist":"./public",
    "url":"http://myproductionsite.xyz"
    "env":"productionsettings.json",
    "build":"npm run build -- --prod",
    "src":"./src",
    "pack":true
  }
}

```
