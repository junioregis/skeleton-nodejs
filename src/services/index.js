const cron = require("./cron.service");
const log = require("./log.service");
const mailer = require("./mailer");
const slack = require("./slack.service");
const scrapper = require("./scraper.service");
const social = require("./social");

module.exports = {
  cron,
  log,
  mailer,
  slack,
  scrapper,
  social,
};
