const express = require("express");

const Layer = require("express/lib/router/layer");

const { handle_request, handle_error } = Layer.prototype;

Layer.prototype.handle_request = function (...args) {
  this.handle = wrapHandler(this.handle);
  this.handle_request = handle_request;

  return this.handle_request(...args);
};

Layer.prototype.handle_error = function (...args) {
  this.handle = wrapHandler(this.handle);
  this.handle_error = handle_error;

  return this.handle_error(...args);
};

function wrapHandler(fn) {
  if (fn.length > 3) {
    return (error, req, res, next) => {
      Promise.resolve(fn(error, req, res, next)).catch(next);
    };
  }

  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const router = express.Router();

const v1 = require("./v1");

function respondTo(version, route) {
  return (req, res, next) => {
    if (req.apiVersion === version) {
      route.call(this, req, res, next);
    } else {
      next();
    }
  };
}

router.use(respondTo(1, v1));

module.exports = router;
