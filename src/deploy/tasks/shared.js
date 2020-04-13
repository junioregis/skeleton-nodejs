const client = require("../client");
const logger = require("../logger");
const util = require("../util");

async function buildCommands(lockedReleasePath, data, config) {
  const result = [];

  if (typeof data !== "undefined") {
    data.forEach((dir) => {
      const target = `${config.paths.shared}/${dir.name}`;
      const source = `${lockedReleasePath}/${dir.source}`;

      result.push(`mkdir -p ${config.paths.shared}/${dir.name}`);
      result.push(`ln -s ${target} ${source}`);
    });
  }

  return result;
}

module.exports = async (config) => {
  logger.t("[task] shared");

  const commands = [];

  const lockedReleasePath = await util.getLockedReleasePath(config);

  const dirCommands = await buildCommands(
    lockedReleasePath,
    config.shared.dirs,
    config
  );

  const fileCommands = await buildCommands(
    lockedReleasePath,
    config.shared.files,
    config
  );

  commands.concat(dirCommands);
  commands.concat(fileCommands);

  for (var i = 0; i < commands.length; i++) {
    const cmd = commands[i];

    await client.exec(cmd, config);
  }
};
