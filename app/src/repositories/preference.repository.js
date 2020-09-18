const { pg } = require("../db");
const { UserError } = require("../errors");

const BaseRepository = require("./base.repository");

class PreferenceRepository extends BaseRepository {
  constructor() {
    super();
  }

  async get(user) {
    const cached = await this.cache.get(`preference-${user.id}`);

    if (cached) return cached;

    try {
      const preference = await pg.models.preferences.findOne({
        where: {
          user_id: user.id,
        },
      });

      await this.cache.set(`preference-${user.id}`, preference, -1);

      return preference;
    } catch (e) {
      throw new UserError(e);
    }
  }

  async update(preference) {
    const user = preference.user;

    try {
      await pg.models.preferences.update(
        {
          locale: preference.locale,
          unit: preference.unit,
          nearby: preference.nearby,
        },
        {
          where: {
            user_id: user.id,
          },
        }
      );
    } catch (e) {
      throw new UserError(e);
    } finally {
      await this.cache.del(`user-${user.id}`);
      await this.cache.del(`preference-${user.id}`);
      await this.cache.del(`nearby-${user.id}`);
    }
  }
}

module.exports = new PreferenceRepository();
