const { logger } = require("./util");

const tasks = require("./tasks");

class Geocoder {
  async update() {
    logger.t("update");

    await tasks.download();

    await tasks.build();
  }
}

module.exports = Geocoder;
