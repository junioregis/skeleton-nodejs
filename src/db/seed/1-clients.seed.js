const uuid = require("uuid");

const db = require("../../db");

const CLIENTS = ["mobile"];

module.exports = {
  up: (queryInterface, Sequelize) => {
    for (var i = 0; i < CLIENTS.length; i++) {
      const client = CLIENTS[i];

      return db.clients.findOrCreate({
        where: {
          name: client,
        },
        defaults: {
          id: uuid.v4(),
          secret: uuid.v4(),
          name: client,
        },
      });
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("clients", null, {});
  },
};
