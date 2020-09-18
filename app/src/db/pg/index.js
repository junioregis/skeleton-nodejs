const path = require("path");
const fs = require("fs");

const db = require("./db");

const modelsPath = __dirname + "/models";

fs.readdirSync(modelsPath)
  .filter((file) => {
    return file.slice(-9) === ".model.js";
  })
  .map((file) => {
    return require(path.join(modelsPath, file));
  })
  .forEach((model) => {
    model.associate();
  });

module.exports = db;
