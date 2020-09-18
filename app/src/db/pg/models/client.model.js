const { DataTypes } = require("sequelize");

const db = require("../db");

const model = db.define(
  "clients",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    secret: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: false,
      },
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: (instance, options) => {
        instance.name = instance.name.toLowerCase();
      },
    },
  }
);

module.exports = {
  associate: () => {
    model.hasMany(db.models.tokens, {
      foreignKey: "client_id",
      as: "tokens",
      onDelete: "CASCADE",
      hooks: true,
    });
  },
};
