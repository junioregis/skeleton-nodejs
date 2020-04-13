const db = require("../db");
const util = require("../util");
const services = require("../services");

const tokenManager = require("../security/token_manager");

const mailer = require("../mailer");

exports.auth = async (client, providerName, accessToken, geo) => {
  var info;

  switch (providerName) {
    case "facebook":
      info = await services.social.facebook.getUser(accessToken);
      break;
    case "google":
      info = await services.social.google.getUser(accessToken);
      break;
    default:
      return {
        type: "error",
        token: null,
      };
  }

  const user = await db.users.findOne({
    where: {
      email: info.email,
    },
    include: [
      {
        model: db.providers,
        as: "providers",
      },
    ],
  });

  const profile = {
    name: info.name,
    birthday: info.birthday,
    gender: info.gender,
  };

  const provider = {
    name: providerName,
    id: info.provider_id,
  };

  const preference = {
    locale: geo.lang,
    unit: geo.unit,
  };

  var type;
  var token;

  if (user !== null) {
    const providerInfo = user.providers.find(
      (item) => item.name === providerName
    );

    if (typeof providerInfo !== "undefined") {
      type = "signin";

      token = await tokenManager.create(
        client.id,
        user.id,
        tokenManager.scopes.user
      );
    } else {
      return {
        type: "error",
      };
    }
  } else {
    type = "signup";

    await db.sequelize.transaction(async (transaction) => {
      const newUser = await db.users.create(
        {
          email: info.email,
          providers: [provider],
          profile: profile,
          preference: preference,
        },
        {
          include: [
            {
              model: db.providers,
              as: "providers",
            },
            {
              model: db.profiles,
              as: "profile",
            },
            {
              model: db.preferences,
              as: "preference",
            },
          ],
          transaction: transaction,
        }
      );

      token = await tokenManager.create(
        client.id,
        newUser.id,
        tokenManager.scopes.user,
        transaction
      );

      try {
        const response = await util.net.get(info.photo);

        if (response.statusCode === 200) {
          const data = response.body;

          await db.profiles.savePhoto(data, newUser.id);
        } else {
          await transaction.rollback();
        }
      } catch (e) {
        await transaction.rollback();
      }

      try {
        const options = {
          to: newUser.email,
          subject: "Welcome!",
          html: "<b>Hello World!</b>",
        };

        await mailer.send(options);
      } catch (e) {
        await transaction.rollback();
      }
    });
  }

  delete token.client_id;
  delete token.user_id;

  return {
    type: type,
    token: token,
  };
};

exports.refresh = async (refreshToken) => {
  return tokenManager.refresh(refreshToken);
};

exports.revoke = async (accessToken) => {
  return tokenManager.revoke(accessToken);
};
