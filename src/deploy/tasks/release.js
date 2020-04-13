const moment = require("moment");

const client = require("../client");
const logger = require("../logger");

module.exports = async (config) => {
  logger.t("[task] release");

  const releaseLabel = moment.utc().format("YYYYMMDDHHmmss");
  const releasePath = `${config.paths.releases}/${releaseLabel}`;

  const options = { cwd: config.paths.workspace };

  await client.exec(`touch ${config.paths.lockFile}`, config, options);

  await client.exec(
    `echo ${releaseLabel} > ${config.paths.lockFile}`,
    config,
    options
  );

  await client.exec(`mkdir -p ${releasePath}`, config, options);

  const params = config.ignore
    .map((item) => {
      return `--exclude="${item}"`;
    })
    .join(" ");

  await client.exec(
    `rsync -avzP ${params} ${config.paths.workspace}/[^.]* ${releasePath}/`,
    config
  );
};
