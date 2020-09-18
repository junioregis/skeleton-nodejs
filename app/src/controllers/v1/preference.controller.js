const i18n = require("../../i18n");
const { cache } = require("../../services");
const { ValidatorUtil } = require("../../util");

const BaseController = require("./base.controller");

const repository = require("../../repositories/preference.repository");

const CACHE = {
  get: -1, // Infinity
};

class PreferenceController extends BaseController {
  constructor() {
    super();
  }

  async get(req, res, next) {
    const user = req.currentUser;
    const preference = await repository.get(user);

    const body = {
      result: {
        locale: preference.locale,
        unit: preference.unit,
        nearby: preference.nearby,
      },
    };

    await cache.set(req, "preference", body, CACHE.get);

    res.send(body);
  }

  async update(req, res, next) {
    try {
      ValidatorUtil.validate(req);

      const currentUser = req.currentUser;

      const preference = {
        user: currentUser,
        locale: req.body.locale,
        unit: req.body.unit,
        nearby: req.body.nearby,
      };

      await repository.update(preference);

      const body = {
        meta: {
          message: i18n.t(
            currentUser.preference.locale,
            "preference.update.successful"
          ),
        },
      };

      res.send(body);
    } finally {
      await cache.del(req, "preference");
      await cache.del(req, "nearby");
    }
  }
}

module.exports = new PreferenceController();
