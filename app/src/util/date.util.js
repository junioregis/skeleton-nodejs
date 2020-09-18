const moment = require("moment");

class DateUtil {
  static now() {
    const date = new Date(Date.now());

    return date;
  }

  static nowInUtc() {
    return this.toUtc(this.now());
  }

  static toUtc(date) {
    return new Date(date.toUTCString());
  }

  static fromString(date, format) {
    return moment(date, format);
  }

  static toAge(birthday) {
    const date = new Date(birthday);

    return moment().diff(date, "years", false);
  }
}

module.exports = DateUtil;
