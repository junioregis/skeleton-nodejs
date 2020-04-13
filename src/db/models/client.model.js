module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
    "clients",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      secret: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: false
        }
      }
    },
    {
      timestamps: false
    }
  );

  model.associate = function(models) {
    model.hasMany(models.tokens, {
      foreignKey: "client_id",
      as: "tokens",
      onDelete: "CASCADE",
      hooks: true
    });
  };

  return model;
};
