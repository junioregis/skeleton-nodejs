const { UnauthorizedError } = require("../errors");

const db = require("../db");
const util = require("../util");

module.exports = async (req, res, next) => {
  const auth = req.headers["authorization"];

  if (typeof auth !== "undefined") {
    const bearer = auth.split(" ");
    const accessToken = bearer[1];

    const token = await db.tokens.findOne({
      access_token: accessToken,
      include: [
        {
          model: db.users,
          as: "user",
          include: [
            {
              model: db.profiles,
              as: "profile",
            },
            {
              model: db.preferences,
              as: "preference",
            },
          ],
        },
      ],
    });

    if (token !== null) {
      const now = util.date.nowInUtc();
      const expirationDate = util.date.toUtc(new Date(token.expiration_date));

      const isExpired = now > expirationDate;

      if (!isExpired) {
        req.currentUser = token.user;
        next();
      } else {
        throw new UnauthorizedError();
      }
    } else {
      throw new UnauthorizedError();
    }
  } else {
    throw new UnauthorizedError();
  }
};
