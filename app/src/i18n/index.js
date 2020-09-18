const path = require("path");
const fs = require("fs");
const { logger } = require("../services");

class I18n {
  constructor() {
    this.localesPath = __dirname + "/locales";
    this.locales = {};

    fs.readdirSync(this.localesPath).forEach((file) => {
      const localeName = path.basename(file).split(".")[0];
      const json = fs.readFileSync(path.join(this.localesPath, file));

      this.locales[localeName] = JSON.parse(json);
    });
  }

  t(locale, key, ...params) {
    try {
      const fn = new Function(
        "obj",
        `try { return obj.${key}; } catch(e) { return "${key}"; }`
      );

      if (typeof params !== "undefined") {
        var value = fn(this.locales[locale]);

        for (let i = 0; i < params.length; i++) {
          const regex = new RegExp("\\$" + (i + 1), "g");

          value = value.replace(regex, params[i]);
        }

        return value;
      } else {
        return fn(this.locales[locale]);
      }
    } catch (e) {
      logger.e(`[i18n] ${e}`);
      return key;
    }
  }
}

module.exports = new I18n();
