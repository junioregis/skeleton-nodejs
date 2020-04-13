const moment = require("moment");

function now() {
  const date = new Date(Date.now());

  return date;
}

function nowInUtc() {
  return toUtc(now());
}

function toUtc(date) {
  return new Date(date.toUTCString());
}

function fromString(date, format) {
  return moment(date, format);
}

module.exports = {
  now,
  nowInUtc,
  toUtc,
  fromString
};
