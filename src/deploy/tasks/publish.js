const client = require("../client");
const logger = require("../logger");
const util = require("../util");

module.exports = async (config) => {
  logger.t("[task] publish");

  const lockedRelease = await util.getLockedRelease(config);
  const lockedReleasePath = await util.getLockedReleasePath(config);

  await client.exec(
    `ln -nfs ${lockedReleasePath} ${config.paths.current}`,
    config
  );

  await client.exec(`touch ${config.paths.releaseFile}`, config);

  await client.exec(
    `echo ${lockedRelease} > ${config.paths.releaseFile}`,
    config
  );

  await client.exec(`rm ${config.paths.lockFile}`, config);
};
