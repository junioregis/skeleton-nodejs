const i18n = require("../../i18n");

const repository = require("../../repositories/auth.repository");

const { body, validationResult } = require("express-validator/check");

exports.validate = (method) => {
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

exports.auth = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const client = req.client;
    const provider = req.body.provider;
    const accessToken = req.body.access_token;
    const geo = req.geo;

    const { type, token } = await repository.auth(
      client,
      provider,
      accessToken,
      geo
    );

    if (type !== "error") {
      res.header("Type", type);

      return res.send(token);
    } else {
      return res.status(401).json();
    }
  } catch (e) {
    next(e);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const refreshToken = req.body.refresh_token;

    if (typeof refreshToken !== "undefined") {
      const token = await repository.refresh(refreshToken);

      if (token !== null) {
        return res.send(token);
      } else {
        return res.status(401).json();
      }
    } else {
      return res.status(404).json();
    }
  } catch (e) {
    next(e);
  }
};

exports.revoke = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const accessToken = req.body.access_token;

    if (typeof accessToken !== "undefined") {
      await repository.revoke(accessToken);

      return res.status(200).json();
    } else {
      return res.status(401).json();
    }
  } catch (e) {
    next(e);
  }
};
