const { DataTypes } = require("sequelize");

const db = require("../db");

const model = db.define(
  "tokens",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    client_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: false,
      },
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: false,
      },
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function () {
        const val = this.getDataValue("expiration_date");

        return val ? val.getTime() : undefined;
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
        isIn: [["bearer"]],
      },
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function () {
        const val = this.getDataValue("issue_date");

        return val ? val.getTime() : undefined;
      },
    },
    scopes: {
      type: DataTypes.STRING,
      allowNull: false,
      get: function () {
        const val = this.getDataValue("scopes");

        return val ? val.split(",") : undefined;
      },
      set: function (val) {
        return this.setDataValue("scopes", val.join(","));
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = {
  associate: () => {
    model.belongsTo(db.models.clients, {
      foreignKey: "client_id",
      as: "client",
    });

    model.belongsTo(db.models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  },
};
