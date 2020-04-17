const repository = require("../../repositories/auth.repository");

const { ProviderError, UnauthorizedError } = require("../../errors");

const { validator } = require("../../util");

const validate = require("./validations/auth.validation");

class AuthController {
  constructor() {
    this.validate = validate;
  }

  async auth(req, res, next) {
    try {
      validator.validate(req);

      const client = req.client;
      const provider = req.body.provider;
      const accessToken = req.body.access_token;
      const geo = req.geo;

      const { type, token } = await repository.auth(
        client,
        provider,
        accessToken,
        geo
      );

      if (type !== "error") {
        res.header("Type", type);

        return res.send(token);
      } else {
        throw new ProviderError(req.body.provider);
      }
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      validator.validate(req);

      const refreshToken = req.body.refresh_token;

      if (typeof refreshToken !== "undefined") {
        const token = await repository.refresh(refreshToken);

        if (token !== null) {
          return res.send(token);
        } else {
          throw new UnauthorizedError();
        }
      } else {
        throw new NotFoundError();
      }
    } catch (e) {
      next(e);
    }
  }

  async revoke(req, res, next) {
    try {
      validator.validate(req);

      const accessToken = req.body.access_token;

      if (typeof accessToken !== "undefined") {
        await repository.revoke(accessToken);

        return res.status(200).json();
      } else {
        throw new UnauthorizedError();
      }
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
