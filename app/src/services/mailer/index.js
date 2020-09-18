const mailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const config = require("../../config");
const logger = require("../logger.service");

class MailerService {
  async load() {
    this.transporter = mailer.createTransport({
      host: config.mailer.host,
      port: config.mailer.port,
      secure: true,
      auth: {
        user: config.mailer.user,
        pass: config.mailer.pass,
      },
    });

    return new Promise((resolve, reject) => {
      this.transporter.verify(function (err, success) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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
      logger.e(`[mailer] ${e}`);
    }
  }
}

module.exports = new MailerService();
