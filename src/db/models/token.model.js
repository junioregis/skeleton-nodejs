const VALID_SCOPES = ["user"];

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "tokens",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      client_id: {
        allowNull: false,
        type: DataTypes.UUID
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: false
        }
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: false
        }
      },
      expiration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        get: function() {
          return this.getDataValue("expiration_date").getTime();
        }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
          isIn: [["bearer"]]
        }
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: false,
        get: function() {
          return this.getDataValue("issue_date").getTime();
        }
      },
      scopes: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: function(value) {
            const scopes = value.split(",");

            scopes.forEach(scope => {
              if (!VALID_SCOPES.includes(scope)) {
                throw new Error(`scope ${scope} not allowed`);
              }
            });
          }
        },
        get: function() {
          return this.getDataValue("scopes").split(",");
        },
        set: function(val) {
          return this.setDataValue("scopes", val.join(","));
        }
      }
    },
    {
      timestamps: false
    }
  );

  model.associate = models => {
    model.belongsTo(models.clients, {
      foreignKey: "client_id",
      as: "client"
    });

    model.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return model;
};
