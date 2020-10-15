const path = require("path");
const { DataTypes } = require("sequelize");

const db = require("../db");
const { DateUtil, ImageUtil } = require("../../../util");

const genders = ["male", "female"];

const model = db.define(
  "profiles",
  {
    user_id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
      },
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
      get: function () {
        const val = this.getDataValue("birthday");

        return val ? val.getTime() : undefined;
      },
    },
    age: {
      type: DataTypes.VIRTUAL,
      get() {
        const val = this.getDataValue("birthday");

        return val ? DateUtil.toAge(val) : undefined;
      },
      set(value) {
        throw new Error("read only");
      },
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        isIn: [genders],
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
      },
    },
  },
  {
    timestamps: false,
  }
);

model.genders = genders;

model.savePhoto = async (user_id, data) => {
  const filePath = path.join("profiles", user_id);

  await ImageUtil.save(data, filePath);
};

module.exports = {
  associate: () => {
    model.belongsTo(db.models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  },
};
