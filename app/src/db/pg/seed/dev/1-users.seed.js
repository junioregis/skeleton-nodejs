const faker = require("faker");

const { pg } = require("../../../index");
const config = require("../../../../config");
const geo = require("../../../../geo");
const { DateUtil } = require("../../../../util");

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (config.isProduction) return Promise.resolve();

    const providers = await pg.models.providers.findAll({
      where: {
        id: {
          [Sequelize.Op.not]: "0",
        },
      },
      include: [
        {
          model: pg.models.users,
          as: "user",
          include: [
            {
              model: pg.models.preferences,
              as: "preference",
            },
          ],
        },
      ],
    });

    const newUsers = providers.map((provider) => {
      const user = provider.user;

      const radius = provider.user.preference.nearby;

      const location = geo.random(user.latitude, user.longitude, radius, "km");

      const gender = faker.random.boolean() ? "male" : "female";

      const age = randomInt(18, 40);
      const birthday = new Date(DateUtil.now().getFullYear() - age, 0, 1);

      return {
        email: faker.internet.email(),
        location: {
          type: "point",
          coordinates: [location.latitude, location.longitude],
        },
        providers: [
          {
            id: "0",
            name: faker.random.boolean() ? "facebook" : "google",
          },
        ],
        profile: {
          name: faker.name.findName(),
          birthday: birthday,
          gender: gender,
          city: location.city,
          country: location.country,
        },
        preference: {
          locale: "en",
          unit: "miles",
        },
      };
    });

    return pg.models.users.bulkCreate(newUsers, {
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
    });
  },
};
