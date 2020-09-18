const { pg } = require("../db");
const { social } = require("../services");
const { UnauthorizedError } = require("../errors");

const BaseRepository = require("./base.repository");

const tokenRepository = require("./token.repository");
const userRepository = require("./user.repository");

class AuthRepository extends BaseRepository {
  constructor() {
    super();
  }

  async auth(client, providerName, accessToken, geo) {
    var info;

    switch (providerName) {
      case "facebook":
        info = await social.facebook.getUser(accessToken);
        break;
      case "google":
        info = await social.google.getUser(accessToken);
        break;
      default:
        throw new UnauthorizedError("invalid provider name");
    }

    const user = await pg.models.users.findOne({
      where: {
        email: info.email,
      },
      include: [
        {
          model: pg.models.providers,
          as: "providers",
        },
      ],
    });

    if (user) {
      const providerInfo = user.providers.find(
        (item) => item.name === providerName && item.login
      );

      if (typeof providerInfo !== "undefined") {
        const token = await tokenRepository.create(client, user);

        return {
          type: "signin",
          token: token,
        };
      } else {
        throw new UnauthorizedError();
      }
    } else {
      try {
        const { token } = await userRepository.create(client, info, geo);

        return {
          type: "signup",
          token: token,
        };
      } catch (e) {
        throw new UnauthorizedError(e);
      }
    }
  }
}

module.exports = new AuthRepository();
