const express = require("express");
const router = express.Router();

const middlewares = require("../../middlewares");

const controllers = require("../../controllers/v1");
const controller = controllers.profile;

router.use(middlewares.auth);

router.route("/me").get(controller.me);
router.route("/me").put(controller.validate("update"), controller.update);

module.exports = router;
