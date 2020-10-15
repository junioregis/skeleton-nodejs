const { UnauthorizedError } = require("../errors");
const repository = require("../repositories/client.repository");

module.exports = async (req, res, next) => {
  const clientId = req.headers["client_id"];
  const clientSecret = req.headers["client_secret"];

  if (typeof clientId !== "undefined" || typeof clientSecret !== "undefined") {
    const client = await repository.find(clientId, clientSecret);

    if (client) {
      req.client = client;
      next();
    } else {
      next(new UnauthorizedError());
    }
  } else {
    next(new UnauthorizedError());
  }
};
