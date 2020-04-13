const express = require("express");
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
