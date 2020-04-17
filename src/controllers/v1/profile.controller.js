const path = require("path");

const repository = require("../../repositories/profile.repository");

const i18n = require("../../i18n");

const { validator } = require("../../util");

const validate = require("./validations/profile.validation");

const imagesPath = "/img/profiles";

class ProfileController {
  constructor() {
    this.validate = validate;
  }

  async me(req, res, next) {
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
  }

  async update(req, res, next) {
    try {
      validator.validate(req);

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
  }
}

module.exports = new ProfileController();
