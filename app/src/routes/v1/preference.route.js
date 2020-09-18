const express = require("express");

const {
  auth: authMiddleware,
  cache: cacheMiddleware,
} = require("../../middlewares");

const { preference: controller } = require("../../controllers/v1");

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(cacheMiddleware("preference"), controller.get);

router.route("/").post(controller.validate("update"), controller.update);

module.exports = router;
