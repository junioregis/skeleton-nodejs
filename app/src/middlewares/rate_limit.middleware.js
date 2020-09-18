const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  headers: false,
  handler: function (req, res, next) {
    res.format({
      json: function () {
        res.status(429).json();
      },
    });
  },
});
