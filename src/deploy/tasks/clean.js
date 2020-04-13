const client = require("../client");
const logger = require("../logger");

module.exports = async (config) => {
  logger.t("[task] clean");

  const cmd = [
    `(ls -rd ${config.paths.releases}/* | head -n ${config.keepReleases}; ls -d ${config.paths.releases}/*)`,
    `sort`,
    `uniq -u`,
    `xargs rm -rf`,
  ].join(" | ");

  await client.exec(cmd, config);
};
