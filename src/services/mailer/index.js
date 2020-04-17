const mailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const config = require("../../config");
const log = require("../log.service");

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
        log.i(`[mailer] ready`);
      }
    });
  }

  async render(options) {
    const template = path.join(
      __dirname,
      "templates",
      `${options.template}.template.${options.locale}.html`
    );

    return new Promise((resolve, reject) => {
      ejs.renderFile(template, options.locals, {}, (err, str) => {
        if (err) {
          reject(err);
        } else {
          resolve(str);
        }
      });
    });
  }

  async send(options) {
    try {
      const html = await this.render({
        template: options.template,
        locale: options.locale,
        locals: options.locals,
      });

      await this.transporter.sendMail({
        from: `${config.mailer.from} <${config.mailer.user}>`,
        to: options.to,
        subject: options.subject,
        html: html,
      });
    } catch (e) {
      log.e(`[mailer] ${e}`);
    }
  }
}

module.exports = new Mailer();
