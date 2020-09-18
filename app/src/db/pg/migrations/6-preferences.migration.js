module.exports = {
  up: (queryInterface, Sequelize) => {
    const table = queryInterface.createTable("preferences", {
      user_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
      },
      locale: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nearby: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    return table;
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("preferences");
  },
};
