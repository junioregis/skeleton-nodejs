module.exports = {
  up: (queryInterface, Sequelize) => {
    const table = queryInterface.createTable("photos", {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    return table;
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("photos");
  },
};
