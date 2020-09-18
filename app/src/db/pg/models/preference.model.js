const geo = require("../../../geo");
const { DataTypes } = require("sequelize");

const db = require("../db");

const model = db.define(
  "preferences",
  {
    user_id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
        isIn: [geo.locales],
      },
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
        isIn: [geo.units],
      },
    },
    nearby: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
      defaultValue: 10,
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
