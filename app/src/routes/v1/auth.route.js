const express = require("express");

const { auth: authMiddleware } = require("../../middlewares");
const { auth: controller } = require("../../controllers/v1");

const router = express.Router();

router.route("/").post(controller.validate("auth"), controller.auth);

router.use(authMiddleware);

router
  .route("/refresh")
  .post(controller.validate("refresh"), controller.refresh);

router.route("/revoke/all").get(controller.revokeAll);

router.route("/revoke").post(controller.validate("revoke"), controller.revoke);

module.exports = router;
