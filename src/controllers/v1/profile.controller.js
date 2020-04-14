const path = require("path");

const repository = require("../../repositories/profile.repository");

const i18n = require("../../i18n");

const imagesPath = "/img/profiles";

const { body, validationResult } = require("express-validator/check");

const db = require("../../db");

exports.validate = (method) => {
  switch (method) {
    case "update": {
      return [
        body("name")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
        body("birthday")
          .isInt()
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
        body("gender")
          .isIn(db.profiles.genders)
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
        body("photo")
          .exists()
          .notEmpty()
          .withMessage((value, { req }) =>
            i18n.t(req.geo.lang, "validations.default.required")
          ),
      ];
    }
  }
};

exports.me = async (req, res, next) => {
  try {
    const currentUser = req.currentUser;
    const profile = await repository.me(currentUser);

    const result = profile.toJSON();

    result.photo = path.join(imagesPath, currentUser.id);

    return res.send({
      result: result,
    });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const currentUser = req.currentUser;

    const profile = {
      user: currentUser,
      name: req.body.name,
      birthday: req.body.birthday,
      gender: req.body.gender,
      photo: req.body.photo,
    };

    await repository.update(profile);

    return res.send({
      meta: {
        message: i18n.t(
          currentUser.preference.locale,
          "profile.update.successful"
        ),
      },
    });
  } catch (e) {
    next(e);
  }
};
