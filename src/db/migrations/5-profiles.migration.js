module.exports = {
  up: (queryInterface, Sequelize) => {
    const table = queryInterface.createTable(
      "profiles",
      {
        user_id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        birthday: {
          type: Sequelize.DATE,
          allowNull: false
        },
        gender: {
          type: Sequelize.STRING
        }
      },
      {
        timestamps: false
      }
    );

    return table;
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("profiles");
  }
};
