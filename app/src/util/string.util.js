const crypto = require("crypto");

class StringUtil {
  static genString(length) {
    return crypto.randomBytes(length).toString("hex");
  }
}

module.exports = StringUtil;
