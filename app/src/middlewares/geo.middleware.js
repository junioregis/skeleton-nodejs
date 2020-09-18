const geo = require("../geo");

module.exports = async (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const lat = req.headers["latitude"];
  const lng = req.headers["longitude"];

  if (typeof lat !== "undefined" && typeof lng !== "undefined") {
    req.geo = geo.reverse(parseFloat(lat), parseFloat(lng));
  } else {
    req.geo = geo.lookup(ip);
  }

  req.geo.ip = ip;

  next();
};
