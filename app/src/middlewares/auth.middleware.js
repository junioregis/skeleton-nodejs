const { UnauthorizedError } = require("../errors");

const tokenRepository = require("../repositories/token.repository");
const userRepository = require("../repositories/user.repository");
const { logger } = require("../services");

module.exports = async (req, res, next) => {
  const auth = req.headers["authorization"];

  if (typeof auth !== "undefined") {
    const bearer = auth.split(" ");
    const accessToken = bearer[1];

    const token = await tokenRepository.get(accessToken);

    if (token) {
      const currentUser = await userRepository.get(token.user.id);
      const location = req.geo;

      req.currentUser = currentUser;

      try {
        await userRepository.updateLocation(currentUser, location);
        next();
      } catch (e) {
        logger.e(e);
        next(new UnauthorizedError(e));
      }
    } else {
      next(new UnauthorizedError());
    }
  } else {
    next(new UnauthorizedError());
  }
};
