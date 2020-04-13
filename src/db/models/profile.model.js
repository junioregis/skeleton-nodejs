const sharp = require("sharp");
const path = require("path");

const util = require("../../util");

const genders = [null, "male", "female"];

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(
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
          return this.getDataValue("birthday").getTime();
        },
      },
      gender: {
        type: DataTypes.STRING,
        validate: {
          isIn: [genders],
        },
      },
    },
    {
      timestamps: false,
    }
  );

  model.associate = (models) => {
    model.belongsTo(models.users, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  model.genders = genders;

  model.savePhoto = async (data, user_id) => {
    const filePath = path.join(util.file.uploadsPath, "profiles", user_id);

    const buffer = await util.file.toBuffer(data);

    await sharp(buffer)
      .resize(512, 512, {
        fit: sharp.fit.cover,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 100,
      })
      .toFile(filePath);
  };

  return model;
};
