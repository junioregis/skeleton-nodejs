const { body } = require("express-validator");

const i18n = require("../../../i18n");

module.exports = (method) => {
  switch (method) {
    case "auth": {
      return [
        body("grant_type")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
        body("provider")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
        body("access_token")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
      ];
    }
    case "refresh": {
      return [
        body("refresh_token")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
      ];
    }
    case "revoke": {
      return [
        body("access_token")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
      ];
    }
  }
};
