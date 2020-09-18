const validations = require("./validations");

class BaseController {
  constructor() {
    const controllerName = this.__proto__.constructor.name
      .split(/controller/i)[0]
      .toLowerCase();

    this.validate = validations[controllerName];
  }
}

module.exports = BaseController;
