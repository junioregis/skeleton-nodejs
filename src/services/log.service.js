const colors = require("colors");

const config = require("../config");
const slack = require("./slack.service");

function send(type, text, sendToSlack = true) {
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

exports.i = (text, sendToSlack = true) => {
  send("info", text, sendToSlack);
};

exports.w = (text, sendToSlack = true) => {
  send("warning", text, sendToSlack);
};

exports.e = (text, sendToSlack = true) => {
  send("error", text, sendToSlack);
};
