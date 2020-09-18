const { body } = require("express-validator");

const i18n = require("../../../i18n");

module.exports = (method) => {
  switch (method) {
    case "update": {
      return [
        body("locale")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
        body("unit")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
        body("nearby")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
      ];
    }
  }
};
