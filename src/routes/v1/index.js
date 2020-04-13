const express = require("express");
const router = express.Router();

const auth = require("./auth.route");
const profile = require("./profile.route");

router.use("/auth", auth);
router.use("/profile", profile);

module.exports = router;
