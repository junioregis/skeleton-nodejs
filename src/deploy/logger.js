const colors = require("colors");

// App
function a(text) {
  console.log(colors.cyan(text));
}

// Task
function t(text, options = { space: 0 }) {
  console.log(spaces(options.space) + colors.magenta(text));
}

// Debug
function d(text, options = { space: 0 }) {
  console.log(spaces(options.space) + text);
}

// Info
function i(text, options = { space: 0 }) {
  console.log(spaces(options.space) + colors.blue(text));
}

// Warning
function w(text, options = { space: 0 }) {
  console.log(spaces(options.space) + colors.yellow(text));
}

// Error
function e(text, options = { space: 0 }) {
  console.log(spaces(options.space) + colors.red(text));
}

// Success
function s(text, options = { space: 0 }) {
  console.log(spaces(options.space) + colors.green(text));
}

function spaces(count) {
  return " ".repeat(count);
}

module.exports = {
  a,
  t,
  d,
  i,
  w,
  e,
  s,
};
