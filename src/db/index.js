const Sequelize = require("sequelize");

const path = require("path");
const fs = require("fs");

var env = process.env.NODE_ENV || "development";

var config = require("./config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

const modelsPath = __dirname + "/models";

fs.readdirSync(modelsPath)
  .filter(file => {
    return file.slice(-9) === ".model.js";
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(modelsPath, file));

    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
