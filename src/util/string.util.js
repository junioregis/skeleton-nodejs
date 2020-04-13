const crypto = require("crypto");

exports.genString = length => {
  return crypto.randomBytes(length).toString("hex");
};
