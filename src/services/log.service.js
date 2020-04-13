const config = require("../config");
const slack = require("./slack.service");

function send(type, text, sendToSlack = true) {
  console.log(text);

  if (!config.isDevelopment) {
    if (sendToSlack) {
      switch (type) {
        case "info":
          slack.i(text);
          break;
        case "error":
          slack.e(text);
          break;
      }
    }
  }
}

exports.i = (text, sendToSlack = true) => {
  send("info", text, sendToSlack);
};

exports.e = (text, sendToSlack = true) => {
  send("error", text, sendToSlack);
};
