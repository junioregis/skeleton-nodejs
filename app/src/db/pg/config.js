const config = require("../../config");

module.exports = {
  username: config.pg.username,
  password: config.pg.password,
  database: config.pg.database,
  host: config.pg.host,
  port: config.pg.port,
  dialect: "postgres",
};
