const path = require("path");
const { DataTypes } = require("sequelize");

const db = require("../db");
const { ImageUtil } = require("../../../util");

const model = db.define(
  "photos",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get: function () {
        const val = this.getDataValue("created_at");

        return val ? val.getTime() : undefined;
      },
    },
  },
  {
    timestamps: false,
  }
);

model.savePhoto = async (user_id, photo_id, data) => {
  const filePath = path.join("photos", user_id, photo_id);

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
