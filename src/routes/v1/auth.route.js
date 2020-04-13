const express = require("express");
const router = express.Router();

const controllers = require("../../controllers/v1");
const controller = controllers.auth;

router.route("/").post(controller.validate("auth"), controller.auth);
router
  .route("/refresh")
  .post(controller.validate("refresh"), controller.refresh);
router.route("/revoke").post(controller.validate("revoke"), controller.revoke);

module.exports = router;
