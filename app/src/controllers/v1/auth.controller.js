const {
  auth: authRepository,
  token: tokenRepository,
} = require("../../repositories");

const { UnauthorizedError } = require("../../errors");
const { ValidatorUtil } = require("../../util");

const BaseController = require("./base.controller");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async auth(req, res, next) {
    ValidatorUtil.validate(req);

    const client = req.client;
    const provider = req.body.provider;
    const accessToken = req.body.access_token;
    const geo = req.geo;

    const { type, token } = await authRepository.auth(
      client,
      provider,
      accessToken,
      geo
    );

    const body = {
      access_token: token.access_token,
      issue_date: token.issue_date,
      expiration_date: token.expiration_date,
      type: token.type,
      scopes: token.scopes,
      refresh_token: token.refresh_token,
    };

    res.header("Type", type);

    return res.send(body);
  }

  async refresh(req, res, next) {
    ValidatorUtil.validate(req);

    const refreshToken = req.body.refresh_token;

    if (typeof refreshToken !== "undefined") {
      const token = await tokenRepository.refresh(refreshToken);

      if (token) {
        const body = {
          access_token: token.access_token,
          issue_date: token.issue_date,
          expiration_date: token.expiration_date,
          type: token.type,
          scopes: token.scopes,
          refresh_token: token.refresh_token,
        };

        return res.send(body);
      } else {
        next(new UnauthorizedError());
      }
    } else {
      next(new NotFoundError());
    }
  }

  async revoke(req, res, next) {
    ValidatorUtil.validate(req);

    const accessToken = req.body.access_token;

    if (typeof accessToken !== "undefined") {
      await tokenRepository.revoke(accessToken);

      return res.status(200).json();
    } else {
      next(new UnauthorizedError());
    }
  }
  async revokeAll(req, res, next) {
    const currentUser = req.currentUser;

    await tokenRepository.revokeAll(currentUser);

    return res.status(200).json();
  }
}

module.exports = new AuthController();
