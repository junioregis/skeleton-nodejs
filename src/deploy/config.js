const fs = require("fs");

const app = "skeleton";
const user = "ubuntu";

const deployTo = `/home/${user}/apps/${app}`;

const config = {
  deployTo: deployTo,
  user: user,
  port: 22,
  repository: "git@github.com:domain/skeleton-nodejs.git",
  keepReleases: 5,
  key: fs.readFileSync("/root/.ssh/id_rsa"),
  ignore: [".git", ".gitignore", ".vscode", "docs", "README.md", "scripts"],
  paths: {
    current: `${deployTo}/current`,
    workspace: `${deployTo}/workspace`,
    releases: `${deployTo}/releases`,
    shared: `${deployTo}/shared`,
    releaseFile: `${deployTo}/RELEASE`,
    lockFile: `${deployTo}/.lock`,
  },
  shared: {
    dirs: [
      {
        source: "src/uploads",
        name: "uploads",
      },
    ],
  },
  stages: {
    staging: {
      host: "staging.domain.com",
      branch: "dev",
    },
    production: {
      host: "app.domain.com",
      branch: "master",
    },
  },
};

module.exports = (stage) => {
  const result = Object.assign(config, config.stages[stage]);

  result.stage = stage;

  delete result.stages;

  return result;
};
