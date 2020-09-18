const { body } = require("express-validator");

const i18n = require("../../../i18n");
const { pg } = require("../../../db");

module.exports = (method) => {
  switch (method) {
    case "update": {
      return [
        body("name")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
        body("birthday")
          .isInt()
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
        body("gender")
          .isIn(pg.models.profiles.genders)
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.locale, "validations.default.required")
          ),
      ];
    }
  }
};
