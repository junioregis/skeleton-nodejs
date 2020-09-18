module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "providers",
      {
        id: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        login: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["id", "user_id", "name"],
          },
        ],
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("providers");
  },
};
