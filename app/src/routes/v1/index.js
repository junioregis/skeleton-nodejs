const express = require("express");

const auth = require("./auth.route");
const preference = require("./preference.route");
const profile = require("./profile.route");

const router = express.Router();

router.use("/auth", auth);
router.use("/preference", preference);
router.use("/profile", profile);

module.exports = router;
