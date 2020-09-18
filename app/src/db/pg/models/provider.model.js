const { DataTypes } = require("sequelize");

const db = require("../db");

const model = db.define(
  "providers",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
        isIn: [["facebook", "google"]],
      },
    },
    login: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  associate: () => {
    model.belongsTo(db.models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  },
};
