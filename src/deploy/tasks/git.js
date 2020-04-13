const client = require("../client");
const logger = require("../logger");

module.exports = async (config) => {
  logger.t("[task] git");

  const options = { cwd: config.paths.workspace };

  await client.exec("git init .", config, options);

  const response = await client.exec(`git remote`, config, options);

  const remotes = response.stdout ? response.stdout.split(/\n/) : [];
  const method = remotes.indexOf("origin") > -1 ? "set-url" : "add";

  await client.exec(
    `git remote ${method} origin ${config.repository}`,
    config,
    options
  );

  await client.exec("git fetch origin --prune", config, options);

  await client.exec(`git checkout ${config.branch}`, config, options);

  await client.exec("git reset --hard HEAD", config, options);

  await client.exec(`git merge origin/${config.branch}`, config, options);
};
