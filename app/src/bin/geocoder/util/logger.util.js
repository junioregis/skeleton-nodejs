const colors = require("colors");

class Logger {
  // App
  a(text) {
    console.log(colors.cyan(text));
  }

  // Task
  t(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + colors.magenta(text));
  }

  // Debug
  d(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + text);
  }

  // Info
  i(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + colors.blue(text));
  }

  // Warning
  w(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + colors.yellow(text));
  }

  // Error
  e(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + colors.red(text));
  }

  // Success
  s(text, options = { space: 0 }) {
    console.log(this.spaces(options.space) + colors.green(text));
  }

  spaces(count) {
    return " ".repeat(count);
  }
}

module.exports = new Logger();
