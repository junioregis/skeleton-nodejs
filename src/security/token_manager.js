const db = require("../db");
const util = require("../util");

class TokenManager {
  constructor() {
    this.TOKEN_LENGTH = 30;
    this.EXPIRATION_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days

    this.scopes = {
      user: "user",
    };
  }

  async generate(scopes = []) {
    const date = util.date.now();
    const expirationDate = new Date(
      date.getTime() + this.EXPIRATION_IN_MILLISECONDS
    );

    return {
      access_token: util.string.genString(this.TOKEN_LENGTH),
      issue_date: util.date.toUtc(date).getTime(),
      expiration_date: util.date.toUtc(expirationDate).getTime(),
      type: "bearer",
      scopes: scopes,
      refresh_token: util.string.genString(this.TOKEN_LENGTH),
    };
  }

  async refresh(token) {
    const date = util.date.now();
    const diff = token.expiration_date - token.issue_date;

    const expirationDate = new Date(date.getTime() + diff);

    return {
      access_token: util.string.genString(this.TOKEN_LENGTH),
      issue_date: util.date.toUtc(date).getTime(),
      expiration_date: util.date.toUtc(expirationDate).getTime(),
      type: token.type,
      scopes: token.scopes,
      refresh_token: util.string.genString(this.TOKEN_LENGTH),
    };
  }

  async prune(transaction) {
    const now = util.date.now();
    const Op = db.Sequelize.Op;

    return db.tokens.destroy({
      where: {
        expiration_date: {
          [Op.lt]: now,
        },
      },
      transaction: transaction,
    });
  }

  async create(clientId, userId, scopes, transaction = null) {
    const token = await this.generate(
      Array.isArray(scopes) ? scopes : [scopes]
    );

    token.client_id = clientId;
    token.user_id = userId;

    const options = transaction !== null ? { transaction: transaction } : {};

    await db.tokens.create(token, options);

    await this.prune(transaction);

    return token;
  }

  async refresh(refreshToken) {
    var newToken = null;

    await db.sequelize.transaction(async (transaction) => {
      const token = await db.tokens.findOne({
        include: [
          {
            model: db.users,
            as: "user",
          },
        ],
        where: {
          refresh_token: refreshToken,
        },
        transaction: transaction,
      });

      if (token !== null) {
        newToken = await this.generate(token.scopes);

        await db.tokens.update(newToken, {
          where: {
            refresh_token: refreshToken,
          },
          transaction: transaction,
        });
      }
    });

    return newToken;
  }

  async revoke(accessToken) {
    return db.tokens.destroy({
      where: {
        access_token: accessToken,
      },
    });
  }
}

module.exports = new TokenManager();
