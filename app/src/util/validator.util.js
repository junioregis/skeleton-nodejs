const { validationResult } = require("express-validator");
const { ValidationError } = require("../errors");

class ValidatorUtil {
  static validate(req) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ValidationError(errors);
    }
  }
}

module.exports = ValidatorUtil;
