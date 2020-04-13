const db = require("../db");
const util = require("../util");

const TOKEN_LENGTH = 30;
const EXPIRATION_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days

const scopes = {
  user: "user",
};

function generate(scopes = []) {
  const date = util.date.now();
  const expirationDate = new Date(date.getTime() + EXPIRATION_IN_MILLISECONDS);

  return {
    access_token: util.string.genString(TOKEN_LENGTH),
    issue_date: util.date.toUtc(date).getTime(),
    expiration_date: util.date.toUtc(expirationDate).getTime(),
    type: "bearer",
    scopes: scopes,
    refresh_token: util.string.genString(TOKEN_LENGTH),
  };
}

function refresh(token) {
  const date = util.date.now();
  const diff = token.expiration_date - token.issue_date;

  const expirationDate = new Date(date.getTime() + diff);

  return {
    access_token: util.string.genString(TOKEN_LENGTH),
    issue_date: util.date.toUtc(date).getTime(),
    expiration_date: util.date.toUtc(expirationDate).getTime(),
    type: token.type,
    scopes: token.scopes,
    refresh_token: util.string.genString(TOKEN_LENGTH),
  };
}

async function prune(transaction) {
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

exports.scopes = scopes;

exports.create = async (clientId, userId, scopes, transaction = null) => {
  const token = generate(Array.isArray(scopes) ? scopes : [scopes]);

  token.client_id = clientId;
  token.user_id = userId;

  const options = transaction !== null ? { transaction: transaction } : {};

  await db.tokens.create(token, options);

  await prune(transaction);

  return token;
};

exports.refresh = async (refreshToken) => {
  var newToken;

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
      newToken = refresh(token);

      await db.tokens.update(newToken, {
        where: {
          refresh_token: refreshToken,
        },
        transaction: transaction,
      });
    }
  });

  return newToken;
};

exports.revoke = async (accessToken) => {
  return db.tokens.destroy({
    where: {
      access_token: accessToken,
    },
  });
};
