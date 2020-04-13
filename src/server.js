const express = require("express");
const bodyParser = require("body-parser");

const googleCrapper = require("./services/scrap/google.scrap.service");

const middlewares = require("./middlewares");
const routes = require("./routes");
const i18n = require("./i18n");

const { log } = require("./services");

const PORT = 3000;
const HOST = "0.0.0.0";

const app = express();

// Middlewares: Rate Limit
app.use(middlewares.rateLimit);

// Static
app.use(
  "/",
  express.static("public", {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
);

// Middlewares
app.use(middlewares.apiVersion);
app.use(middlewares.client);
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
  const status = err.status;

  var message = "";

  if (status >= 400 && status < 500) {
    message = "server.bad_request";
  } else {
    message = "server.error";
    log.e(err);
  }

  return res.status(status).json({
    meta: { message: i18n.t(req.geo.lang, message) },
  });
});

// Cron Services
googleCrapper.start();

// Start Server
app.listen(PORT, HOST, () => {
  log.i("server started!");
});
