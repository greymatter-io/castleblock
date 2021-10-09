import utils from "./utils.js";
const settings = {
  port: utils.setEnv(process.env.PORT, 3000),
  host: utils.setEnv(process.env.HOST, "localhost"),
  corsProxyEnable: utils.setEnv(process.env.CORS_PROXY_ENABLE, true),
  originWhitelist: utils.setEnv(process.env.ORIGIN_WHITELIST, [], "json"),
  //["https://google.com", "https://reddit.com"] is an example whitelist
  statusMonitorEnable: utils.setEnv(process.env.STATUS_MONITOR_ENABLE, true),
  swaggerDocsEnable: utils.setEnv(process.env.SWAGGER_DOCS_ENABLE, true),
  assetPath: utils.setEnv(process.env.ASSET_PATH, "./assets"),
  basePath: utils.setEnv(process.env.BASE_PATH, "ui"), //Example path: <castleblock-service.url>/<basePath>/my-app/2.3.4,
  homepage: utils.setEnv(process.env.HOMEPAGE, `castleblock-ui`),
};
console.log(settings);
export default settings;
