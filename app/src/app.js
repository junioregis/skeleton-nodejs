const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");

const { redis } = require("./db");

const {
  rateLimit: middlewareRateLimit,
  assets: middlewareAssets,
  apiVersion: middlewareApiVersion,
  client: middlewareClient,
  geo: middlewareGeo,
} = require("./middlewares");

const routes = require("./routes");
const i18n = require("./i18n");
const { logger, mailer } = require("./services");

const { google: googleScrapper } = require("./services/scrap");

const {
  ProviderError,
  UnauthorizedError,
  ValidationError,
} = require("./errors");

class App {
  constructor(port, host) {
    this.port = port;
    this.host = host;

    this.app = express();
  }

  async loadRedis() {
    try {
      await redis.connect();

      logger.i("[redis] ready");
    } catch (e) {
      throw new Error(`"[redis] ${e}`);
    }
  }

  async loadMailer() {
    try {
      await mailer.load();

      logger.i("[mailer] ready");
    } catch (e) {
      throw new Error(`"[mailer] ${e}`);
    }
  }

  startServices() {
    googleScrapper.start();
  }

  configMiddlewares() {
    this.app.use(helmet());
    this.app.use(middlewareRateLimit);
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(middlewareAssets);
    this.app.use(middlewareApiVersion);
    this.app.use(middlewareClient);
    this.app.use(middlewareGeo);
    this.app.use(
      bodyParser.json({
        limit: "1mb",
      })
    );
    this.app.use(
      bodyParser.urlencoded({
        limit: "1mb",
        extended: true,
      })
    );
  }

  configRoutes() {
    this.app.use(routes);

    this.app.get("*", function (req, res) {
      res.status(404).json();
    });

    this.app.post("*", function (req, res) {
      res.status(404).json();
    });

    this.app.use((err, req, res, next) => {
      var sendToSlack = false;

      if (err instanceof ProviderError) {
        res.status(406).send({
          meta: {
            message: i18n.t(
              req.geo.locale,
              "auth.provider.error",
              err.provider
            ),
          },
        });
      } else if (err instanceof UnauthorizedError) {
        res.status(401).json();
      } else if (err instanceof ValidationError) {
        res.status(422).json({ errors: err.errors.array() });
      } else if (err instanceof multer.MulterError) {
        res.status(406).json();
      } else {
        sendToSlack = true;

        const locale = req.geo?.locale || "en";

        res.status(req.status || 500).json({
          meta: { message: i18n.t(locale, "server.error") },
        });
      }

      logger.e(err, sendToSlack);
    });
  }

  async start() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.loadRedis();
        await this.loadMailer();

        this.startServices();
        this.configMiddlewares();
        this.configRoutes();

        this.app.listen(this.port, this.host, () => {
          logger.i("[server] ready");

          resolve();
        });
      } catch (e) {
        logger.e(e);
        logger.e(`[server] shutdown`);

        reject(e);
      }
    });
  }
}

module.exports = App;
