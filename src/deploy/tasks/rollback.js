const client = require("../client");
const logger = require("../logger");
const util = require("../util");

module.exports = async (config) => {
  logger.t("[task] rollback");

  const releases = await util.getReleases(config);

  const currentRelease = await util.getCurrentRelease(config);

  const currentReleaseIndex = releases.indexOf(currentRelease);

  const prevReleaseIndex = currentReleaseIndex + 1;

  if (prevReleaseIndex >= releases.length) {
    logger.w(`${currentRelease} is already last release`, { space: 2 });
  } else {
    const prevRelease = releases[prevReleaseIndex];

    const commands = [
      `touch ${config.paths.lockFile}`,
      `echo ${prevRelease} > ${config.paths.lockFile}`,
    ].join(" && ");

    logger.i(`[cmd] ${commands}`, { space: 2 });

    await client.exec(commands, config);
  }
};
