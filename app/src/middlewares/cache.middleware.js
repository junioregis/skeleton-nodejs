const { cache, logger } = require("../services");

module.exports = (id) => {
  return async (req, res, next) => {
    const cached = await cache.get(req, id);

    if (cached) {
      logger.w(`[cache] ${req.originalUrl}`);
      res.send(cached);
    } else {
      next();
    }
  };
};
