const development = require("./development.config");
const staging = require("./staging.config");
const production = require("./production.config");

class Config {
  constructor() {
    const environments = {
      development: development,
      staging: staging,
      production: production,
    };

    const env = process.env.NODE_ENV;

    const config = environments[env];

    this.slack = config.slack;
    this.mailer = config.mailer;

    this.isDevelopment = env === "development";
    this.isStaging = env === "staging";
    this.isProduction = env === "production";
  }
}

module.exports = new Config();
