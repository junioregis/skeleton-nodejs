module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "users",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: false,
          isEmail: true
        }
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      timestamps: false
    }
  );

  model.associate = models => {
    model.hasMany(models.tokens, {
      foreignKey: "user_id",
      as: "tokens"
    });

    model.hasMany(models.providers, {
      foreignKey: "user_id",
      as: "providers"
    });

    model.hasOne(models.profiles, {
      foreignKey: "user_id",
      as: "profile"
    });

    model.hasOne(models.preferences, {
      foreignKey: "user_id",
      as: "preference"
    });
  };

  return model;
};
