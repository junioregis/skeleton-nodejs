const cron = require("./cron.service");
const log = require("./log.service");
const slack = require("./slack.service");
const scrapper = require("./scraper.service");
const social = require("./social");

module.exports = {
  cron,
  log,
  slack,
  scrapper,
  social,
};
