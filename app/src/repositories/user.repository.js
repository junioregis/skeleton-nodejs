const geo = require("../geo");
const { pg } = require("../db");
const { DateUtil } = require("../util");
const { mailer, logger } = require("../services");
const { UserError } = require("../errors");
const { Op } = require("sequelize");

const BaseRepository = require("./base.repository");

const preferenceRepository = require("./preference.repository");
const profileRepository = require("./profile.repository");
const tokenRepository = require("./token.repository");

class UserRepository extends BaseRepository {
  constructor() {
    super();

    this.TIME_LIMIT_TO_UPDATE_LOCATION = 15 * 60 * 1000; // 15min
    this.DISTANCE_LIMIT_TO_UPDATE_USER_LOCATION = 1; // in km
  }

  async get(userId) {
    const cached = await this.cache.get(`user-${userId}`);

    if (cached) return cached;

    try {
      const user = await pg.models.users.findOne({
        where: {
          id: userId,
        },
        include: [
          {
            model: pg.models.preferences,
            as: "preference",
          },
        ],
      });

      await this.cache.set(`user-${userId}`, user, -1);

      return user;
    } catch (e) {
      logger.e(e);
      return null;
    }
  }

  async create(client, social, geo) {
    return pg.transaction(async (transaction) => {
      try {
        const user = await pg.models.users.create(
          {
            email: social.email,
            location: {
              type: "point",
              coordinates: [geo.latitude, geo.longitude],
            },
            providers: [
              {
                id: social.provider_id,
                name: social.provider,
                login: true,
              },
            ],
            profile: {
              name: social.name,
              birthday: social.birthday,
              gender: social.gender,
              city: geo.city,
              country: geo.country,
            },
            preference: {
              locale: geo.locale,
              unit: geo.unit,
            },
          },
          {
            include: [
              {
                model: pg.models.providers,
                as: "providers",
              },
              {
                model: pg.models.profiles,
                as: "profile",
              },
              {
                model: pg.models.preferences,
                as: "preference",
              },
            ],
            transaction: transaction,
          }
        );

        await profileRepository.savePhotoFromSocial(
          user,
          social.photo,
          transaction
        );

        try {
          const options = {
            template: "signup",
            locale: geo.locale,
            to: user.email,
            locals: {
              name: user.profile.name,
            },
          };

          mailer.send(options);
        } catch (e) {
          // Ignore
        }

        const token = await tokenRepository.create(client, user, transaction);

        return {
          user: user,
          token: token,
        };
      } catch (e) {
        transaction.rollback();
        throw new UserError(e);
      }
    });
  }

  async updateLocation(user, location) {
    try {
      const distance = geo.distance(
        {
          latitude: user.latitude,
          longitude: user.longitude,
        },
        {
          latitude: user.latitude,
          longitude: user.longitude,
        },
        "km"
      );

      if (distance > this.DISTANCE_LIMIT_TO_UPDATE_USER_LOCATION) {
        const diff = DateUtil.now().getTime() - user.updated_at;

        if (diff > this.TIME_LIMIT_TO_UPDATE_LOCATION) {
          await pg.models.users.update(
            {
              location: {
                type: "point",
                coordinates: [location.latitude, location.longitude],
              },
              profile: {
                city: location.city,
                country: location.country,
              },
            },
            {
              where: {
                id: user.id,
              },
              include: [
                {
                  model: pg.models.profiles,
                  as: "profile",
                },
              ],
            }
          );

          await this.cache.del(`user-${userId}`);
        }
      }
    } catch (e) {
      throw new UserError(e);
    } finally {
      await this.cache.del(`profile-${user.id}`);
    }
  }

  async nearby(currentUser) {
    const cached = await this.cache.get(`nearby-${currentUser.id}`);

    if (cached) return cached;

    try {
      const preference = await preferenceRepository.get(currentUser);

      const unit = preference.unit;
      const nearby = preference.nearby;

      const factor = geo.factors[unit];

      const distance = pg.literal(
        `${factor} * acos(cos(radians(${currentUser.latitude})) * cos(radians(ST_X(location))) * cos(radians(${currentUser.longitude}) - radians(ST_Y(location))) + sin(radians(${currentUser.latitude})) * sin(radians(ST_X(location))))`
      );

      var attributes = ["id", "location"];

      attributes.push([distance, "distance"]);

      const users = await pg.models.users.findAll({
        attributes: attributes,
        order: pg.literal("distance ASC"),
        where: {
          [Op.and]: [
            {
              [Op.not]: {
                id: currentUser.id,
              },
            },
            pg.where(distance, {
              [Op.lte]: nearby,
            }),
          ],
        },
        include: [
          {
            model: pg.models.profiles,
            as: "profile",
          },
        ],
      });

      await this.cache.set(`nearby-${currentUser.id}`, users, 60 * 60);

      return users;
    } catch (e) {
      throw new UserError(e);
    }
  }
}

module.exports = new UserRepository();
