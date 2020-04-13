const client = require("../client");
const logger = require("../logger");

module.exports = async (config) => {
  logger.t("[task] start");

  const options = { cwd: config.paths.current };

  await client.exec(
    `make build DOMAIN='${config.host}' STAGE='${config.stage}'`,
    config,
    options
  );

  await client.exec(`make start`, config, options);
};
