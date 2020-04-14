const db = require("../db");

module.exports = async (req, res, next) => {
  const clientId = req.headers["client_id"];
  const clientSecret = req.headers["client_secret"];

  if (typeof clientId !== "undefined" || typeof clientSecret !== "undefined") {
    const client = await db.clients.findOne({
      where: {
        id: clientId,
        secret: clientSecret,
      },
      attributes: {
        exclude: ["secret"],
      },
    });

    if (client !== null) {
      req.client = client;
      next();
    } else {
      res.status(401).json();
    }
  } else {
    res.status(401).json();
  }
};
