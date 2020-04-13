module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "tokens",
      {
        id: {
          primaryKey: true,
          allowNull: false,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4
        },
        client_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        user_id: {
          allowNull: false,
          type: Sequelize.UUID
        },
        access_token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        refresh_token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        expiration_date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false
        },
        issue_date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        scopes: {
          type: Sequelize.STRING,
          allowNull: false
        }
      },
      {
        timestamps: false
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tokens");
  }
};
