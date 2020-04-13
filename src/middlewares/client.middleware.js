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
    });

    if (client !== null) {
      req.client = client.name;
      next();
    } else {
      res.status(401).json();
    }
  } else {
    res.status(401).json();
  }
};
