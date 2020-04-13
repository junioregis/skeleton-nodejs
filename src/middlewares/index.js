const rateLimit = require("./rate_limit.middleware");
const apiVersion = require("./api_version.middleware");
const client = require("./client.middleware");
const geo = require("./geo.middleware");
const auth = require("./auth.middleware");

module.exports = {
  rateLimit,
  apiVersion,
  client,
  geo,
  auth,
};
