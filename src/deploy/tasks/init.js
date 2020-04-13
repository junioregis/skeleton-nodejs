const client = require("../client");
const logger = require("../logger");

module.exports = async (config) => {
  logger.t("[task] init");

  await client.exec(`mkdir -p ${config.paths.releases}`, config);

  await client.exec(`mkdir -p ${config.paths.shared}`, config);

  await client.exec(`mkdir -p ${config.paths.workspace}`, config);
};
