module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "preferences",
    {
      user_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID
      },
      locale: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
          isIn: [["en", "pt-RB"]]
        }
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
          isIn: [["miles", "km"]]
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
