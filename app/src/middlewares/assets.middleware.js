const path = require("path");
const express = require("express");

const router = express.Router();

const options = {
  maxAge: 60 * 60 * 1000, // 1 hour
};

const rootPath = path.join(path.dirname(process.mainModule.filename), "..");

const publicPath = path.join(rootPath, "src", "public");

router.use(express.static(publicPath, options));

module.exports = router;
