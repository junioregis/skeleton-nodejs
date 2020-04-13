const client = require("./client");

async function getLockedRelease(config) {
  const response = await client.exec(`cat ${config.paths.lockFile}`, config);

  return response.stdout;
}

async function getLockedReleasePath(config) {
  const release = await getLockedRelease(config);

  return `${config.paths.releases}/${release}`;
}

async function getCurrentRelease(config) {
  const response = await client.exec(`cat ${config.paths.releaseFile}`, config);

  return response.stdout;
}

async function getCurrentReleasePath(config) {
  const release = await getCurrentRelease(config);

  return `${config.paths.releases}/${release}`;
}

async function getReleases(config) {
  const cmd = [
    `(ls -rd ${config.paths.releases}/* | ls -d ${config.paths.releases}/*)`,
    `sort -r`,
    `uniq -u`,
  ].join(" | ");

  const response = await client.exec(cmd, config);

  return response.stdout.split("\n").map((item) => {
    return item.substring(`${config.paths.releases}/`.length, item.length);
  });
}

async function cleanReleases(config) {
  const cmd = [
    `(ls -rd ${config.paths.releases}/* | head -n ${config.keepReleases}; ls -d ${config.paths.releases}/*)`,
    `sort`,
    `uniq -u`,
    `xargs rm -rf`,
  ].join(" | ");

  await client.exec(cmd, config);
}

module.exports = {
  getLockedRelease,
  getLockedReleasePath,
  getCurrentRelease,
  getCurrentReleasePath,
  getReleases,
  cleanReleases,
};
