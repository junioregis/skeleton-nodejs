const { DataTypes } = require("sequelize");

const db = require("../db");

function normalize(instance) {
  instance.email = instance.email.toLowerCase();
}

const model = db.define(
  "users",
  {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: false,
        isEmail: true,
      },
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.VIRTUAL,
      get() {
        const val = this.getDataValue("location");

        return val ? val.coordinates[0] : undefined;
      },
      set(value) {
        throw new Error("read only");
      },
    },
    longitude: {
      type: DataTypes.VIRTUAL,
      get() {
        const val = this.getDataValue("location");

        return val ? val.coordinates[1] : undefined;
      },
      set(value) {
        throw new Error("read only");
      },
    },
    distance: {
      type: DataTypes.VIRTUAL,
      get() {
        const val = this.getDataValue("distance");

        return val ? val : 0;
      },
      set(value) {
        throw new Error("read only");
      },
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
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      get: function () {
        const val = this.getDataValue("updated_at");

        return val ? val.getTime() : undefined;
      },
    },
  },
  {
    defaultScope: {
      where: {
        enabled: true,
      },
    },
    hooks: {
      beforeBulkCreate: (instances, options) => {
        instances.forEach((user) => {
          normalize(user);
        });
      },
      beforeCreate: (instance, options) => {
        normalize(instance);
      },
    },
    createdAt: "created_at",
    updatedAt: "updated_at",
    timestamps: true,
  }
);

module.exports = {
  associate: () => {
    model.hasMany(db.models.tokens, {
      foreignKey: "user_id",
      as: "tokens",
      onDelete: "CASCADE",
    });

    model.hasMany(db.models.providers, {
      foreignKey: "user_id",
      as: "providers",
      onDelete: "CASCADE",
    });

    model.hasOne(db.models.profiles, {
      foreignKey: "user_id",
      as: "profile",
      onDelete: "CASCADE",
    });

    model.hasOne(db.models.preferences, {
      foreignKey: "user_id",
      as: "preference",
      onDelete: "CASCADE",
    });

    model.hasMany(db.models.photos, {
      foreignKey: "user_id",
      as: "photos",
      onDelete: "CASCADE",
    });
  },
};
