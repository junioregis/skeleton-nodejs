const { Sequelize } = require("sequelize");

const { logger } = require("../../services");

const config = require("./config");

module.exports = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logQueryParameters: !config.isProduction,
    logging: (statement) => {
      if (!config.isProduction) {
        logger.w(`[database] ${statement}`);
      }
    },
  }
);
