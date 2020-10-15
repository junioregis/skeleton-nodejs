const env = process.env.NODE_ENV;

var isDevelopment = false;
var isStaging = false;
var isProduction = false;

if (env === "production") {
  isProduction = true;
} else if (env === "staging") {
  isStaging = true;
} else {
  isDevelopment = true;
}

module.exports = Object.freeze({
  isDevelopment: isDevelopment,
  isStaging: isStaging,
  isProduction: isProduction,
  pg: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB_NAME,
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  selenium: {
    host: process.env.SELENIUM_HOST,
    port: process.env.SELENIUM_PORT,
  },
  slack: {
    webHook: process.env.SLACK_WEBHOOK,
  },
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
    from: process.env.MAILER_FROM,
  },
});
