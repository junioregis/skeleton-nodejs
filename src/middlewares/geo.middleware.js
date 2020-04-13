const geoip = require("geoip-lite");

const langs = {
  US: "en",
  BR: "pt-BR",
};

const units = {
  US: "miles",
  BR: "km",
};

module.exports = async (req, res, next) => {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  var geo = geoip.lookup(ip);

  if (geo !== null) {
    const lang = langs[geo.country];
    const unit = units[geo.country];

    if (typeof lang !== "undefined") {
      geo.lang = lang;
    } else {
      geo.lang = "en";
    }

    if (typeof unit !== "undefined") {
      geo.unit = unit;
    } else {
      geo.unit = "miles";
    }
  } else {
    geo = {
      ip: ip,
      ll: [0, 0],
      country: "US",
      lang: "en",
      unit: "miles",
    };
  }

  req.geo = {
    ip: ip,
    latitude: geo.ll[0],
    longitude: geo.ll[1],
    country: geo.country,
    lang: geo.lang,
    unit: geo.unit,
  };

  next();
};
