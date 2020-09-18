const { v4: uuid } = require("uuid");

const { pg } = require("../../index");

const CLIENTS = ["mobile"];

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];

    CLIENTS.forEach((client) => {
      promises.push(
        pg.models.clients.findOrCreate({
          where: {
            name: client,
          },
          defaults: {
            id: uuid(),
            secret: uuid(),
            name: client,
          },
        })
      );
    });

    return Promise.all(promises);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("clients", null, {});
  },
};
