const Config = require("./config");

const client = require("./client");
const logger = require("./logger");
const tasks = require("./tasks");

async function showDeployKey(stage) {
  const config = Config(stage);

  logger.w("Configure Repository Key:\n");
  logger.i(
    "Github > Repository > Settings > Deploy Keys > Add Deploy Key > Key > PASTE KEY\n"
  );

  await client.exec("cat ~/.ssh/id_rsa.pub", config);
}

async function deploy(stage) {
  const config = Config(stage);

  var published = false;

  try {
    await tasks.init(config);
    await tasks.git(config);
    await tasks.release(config);
    await tasks.shared(config);
    await tasks.publish(config);

    published = true;
  } catch (e) {
    logger.e(`[err] ${e}`, { space: 2 });
    await client.exec(`rm ${config.paths.lockFile}`, config);
  }

  if (published) {
    try {
      await tasks.start(config);
    } catch (e) {
      logger.e(`[err] ${e}`, { space: 2 });
    }

    try {
      await tasks.clean(config);
    } catch (e) {
      logger.e(`[err] ${e}`, { space: 2 });
    }
  }
}

async function rollback(stage) {
  const config = Config(stage);

  var published = false;

  try {
    await tasks.rollback(config);
    await tasks.publish(config);

    published = true;
  } catch (e) {
    logger.e(`[err] ${e}`, { space: 2 });
    await client.exec(`rm ${config.paths.lockFile}`, config);
  }

  if (published) {
    try {
      await tasks.start(config);
    } catch (e) {
      logger.e(`[err] ${e}`, { space: 2 });
    }
  }
}

module.exports = {
  config: async (stage) => {
    await showDeployKey(stage);
  },
  deploy,
  rollback,
};
