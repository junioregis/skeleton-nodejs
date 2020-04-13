module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "providers",
      {
        id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.STRING
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        }
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["id", "user_id", "name"]
          }
        ],
        timestamps: false
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("providers");
  }
};
