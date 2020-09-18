const { Sequelize } = require("sequelize");

const { pg } = require("../db");
const { TokenError } = require("../errors");
const { DateUtil, StringUtil } = require("../util");
const { logger } = require("../services");

const BaseRepository = require("./base.repository");

class TokenRepository extends BaseRepository {
  constructor() {
    super();

    this.TOKEN_LENGTH = 30;
    this.EXPIRATION_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days

    this.scopes = {
      user: "user",
    };
  }

  async get(accessToken) {
    const cached = await this.cache.get(`token-${accessToken}`);

    if (cached) return cached;

    return pg.transaction(async (transaction) => {
      try {
        const token = await pg.models.tokens.findOne(
          {
            where: {
              access_token: accessToken,
            },
            include: [
              {
                model: pg.models.users,
                as: "user",
              },
            ],
          },
          {
            transaction: transaction,
          }
        );

        if (token) {
          const exp = (token.expiration_date - token.issue_date) / 1000;

          await this.cache.set(`token-${token.access_token}`, token, exp);
        }

        return token;
      } catch (e) {
        logger.e(e);
        transaction.rollback();
        return null;
      }
    });
  }

  async create(client, user, transaction) {
    const token = await this.gen(this.scopes.user);

    token.client_id = client.id;
    token.user_id = user.id;

    const options = transaction ? { transaction: transaction } : {};

    const newToken = await pg.models.tokens.create(token, options);

    await this.prune(transaction);

    return newToken;
  }

  async refresh(refreshToken) {
    return pg.transaction(async (transaction) => {
      try {
        const token = await pg.models.tokens.findOne({
          include: [
            {
              model: pg.models.users,
              as: "user",
            },
          ],
          where: {
            refresh_token: refreshToken,
          },
          transaction: transaction,
        });

        if (token) {
          const newToken = await this.gen(token.scopes);

          const savedToken = await pg.models.tokens.update(newToken, {
            where: {
              refresh_token: refreshToken,
            },
            transaction: transaction,
          });

          await this.cache.set(
            `token-${savedToken.access_token}`,
            savedToken,
            savedToken.expiration_date - savedToken.issue_date
          );

          return newToken;
        }
      } catch (e) {
        logger.e(e);
        return null;
      }
    });
  }

  async revoke(accessToken) {
    return pg.transaction(async (transaction) => {
      try {
        await pg.models.tokens.destroy({
          where: {
            access_token: accessToken,
          },
          transaction: transaction,
        });
      } catch (e) {
        transaction.rollback();
        throw new TokenError(e);
      } finally {
        await this.cache.del(`token-${accessToken}`);
      }
    });
  }

  async pruneCache(user, transaction) {
    const tokens = await pg.models.tokens.findAll({
      where: {
        user_id: user.id,
      },
      transaction: transaction,
    });

    await pg.models.tokens.destroy({
      where: {
        user_id: user.id,
      },
      transaction: transaction,
    });

    for (var i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      await this.cache.del(`token-${token.access_token}`);
    }
  }

  async revokeAll(user) {
    return pg.transaction(async (transaction) => {
      try {
        await pg.models.tokens.destroy({
          where: {
            user_id: user.id,
          },
          transaction: transaction,
        });

        await this.pruneCache(user, transaction);
      } catch (e) {
        transaction.rollback();
        throw new TokenError(e);
      }
    });
  }

  async prune(transaction) {
    const now = DateUtil.now();
    const Op = Sequelize.Op;

    return pg.models.tokens.destroy({
      where: {
        expiration_date: {
          [Op.lt]: now,
        },
      },
      transaction: transaction,
    });
  }

  async gen(scopes) {
    scopes = Array.isArray(scopes) ? scopes : [scopes];

    const date = DateUtil.now();
    const expirationDate = new Date(
      date.getTime() + this.EXPIRATION_IN_MILLISECONDS
    );

    return {
      access_token: StringUtil.genString(this.TOKEN_LENGTH),
      issue_date: DateUtil.toUtc(date).getTime(),
      expiration_date: DateUtil.toUtc(expirationDate).getTime(),
      type: "bearer",
      scopes: scopes,
      refresh_token: StringUtil.genString(this.TOKEN_LENGTH),
    };
  }

  async isExpired(token) {
    const now = DateUtil.nowInUtc();
    const expirationDate = DateUtil.toUtc(new Date(token.expiration_date));

    return now > expirationDate;
  }
}

module.exports = new TokenRepository();
