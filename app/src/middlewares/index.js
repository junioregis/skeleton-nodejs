module.exports = {
  rateLimit: require("./rate_limit.middleware"),
  apiVersion: require("./api_version.middleware"),
  client: require("./client.middleware"),
  geo: require("./geo.middleware"),
  auth: require("./auth.middleware"),
  upload: require("./upload.middleware"),
  assets: require("./assets.middleware"),
  cache: require("./cache.middleware"),
};
