module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "providers",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
          isIn: [["facebook", "google"]]
        }
      }
    },
    {
      timestamps: false
    }
  );

  model.associate = models => {
    model.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return model;
};
