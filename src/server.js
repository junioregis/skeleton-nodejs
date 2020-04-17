const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");

const middlewares = require("./middlewares");
const routes = require("./routes");
const i18n = require("./i18n");

const { log } = require("./services");

const {
  ProviderError,
  UnauthorizedError,
  ValidationError,
} = require("./errors");

const googleCrapper = require("./services/scrap/google.scrap.service");

const PORT = 3000;
const HOST = "0.0.0.0";

const app = express();

// Middleware: Rate Limit
app.use(middlewares.rateLimit);

// Middleware: Compression
app.use(compression());

// Middleware: CORS
app.use(cors());

// Static
app.use(
  "/",
  express.static("public", {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// Middleware: API Versioning
app.use(middlewares.apiVersion);

// Middleware: Client Credentials
app.use(middlewares.client);

// Middleware: Geo
app.use(middlewares.geo);

// Uploads
app.use(
  "/img/profiles",
  express.static("uploads/profiles", {
    maxAge: 24 * 60 * 1000,
  })
);

// Parsers
app.use(
  bodyParser.json({
    limit: "1mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "1mb",
    extended: true,
  })
);

// Routes
app.use(routes);

// 404: Get
app.get("*", function (req, res) {
  res.status(404).json();
});

// 404: Post
app.post("*", function (req, res) {
  res.status(404).json();
});

// Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ProviderError) {
    return res.status(406).send({
      meta: {
        message: i18n.t(req.geo.lang, "auth.provider.error", err.provider),
      },
    });
  } else if (err instanceof UnauthorizedError) {
    return res.status(401).json();
  } else if (err instanceof ValidationError) {
    return res.status(422).json({ errors: err.errors.array() });
  } else {
    log.e(err);

    return res.status(req.status || 500).json({
      meta: { message: i18n.t(req.geo.lang, "server.error") },
    });
  }
});

// Cron Services
googleCrapper.start();

// Start Server
app.listen(PORT, HOST, () => {
  log.i("[server] server started!");
});
