const colors = require("colors");
const config = require("../config");
const slack = require("./slack.service");

class LoggerService {
  send(type, text, sendToSlack = true) {
    switch (type) {
      case "info":
        console.log(colors.bgBlue(text));
        break;
      case "warning":
        console.log(colors.bgYellow(colors.black(text)));
        break;
      case "error":
        console.log(colors.bgRed(text));
        break;
    }

    if (!config.isDevelopment) {
      if (sendToSlack) {
        switch (type) {
          case "error":
            slack.e(text);
            break;
          default:
            slack.i(text);
            break;
        }
      }
    }
  }

  i(text, sendToSlack = true) {
    this.send("info", text, sendToSlack);
  }

  w(text, sendToSlack = true) {
    this.send("warning", text, sendToSlack);
  }

  e(text, sendToSlack = true) {
    this.send("error", text, sendToSlack);
  }
}

module.exports = new LoggerService();
