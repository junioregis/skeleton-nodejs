const mailer = require("nodemailer");

const config = require("../config");
const log = require("../services/log.service");

class Mailer {
  constructor() {
    this.transporter = mailer.createTransport({
      host: config.mailer.host,
      port: config.mailer.port,
      secure: true,
      auth: {
        user: config.mailer.user,
        pass: config.mailer.pass,
      },
    });

    this.transporter.verify(function (error, success) {
      if (error) {
        log.e(`[mailer] ${error}`);
      } else {
        log.i(`[mailer] ${success}`);
      }
    });
  }

  async send(options) {
    try {
      await this.transporter.sendMail({
        from: `${config.mailer.from} <${config.mailer.user}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } catch (e) {
      log.e(`[mailer] ${e}`);
    }
  }
}

module.exports = new Mailer();
