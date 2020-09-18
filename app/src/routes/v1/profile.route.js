const express = require("express");

const {
  auth: authMiddleware,
  cache: cacheMiddleware,
  upload: uploadMiddleware,
} = require("../../middlewares");

const { profile: controller } = require("../../controllers/v1");

const router = express.Router();

router.use(authMiddleware);

router.route("/me").get(cacheMiddleware("me"), controller.me);

router.route("/me").post(controller.validate("update"), controller.update);

router
  .route("/me/photo")
  .post(uploadMiddleware.single("file"), controller.updatePhoto);

router
  .route("/me/photo/add")
  .post(uploadMiddleware.single("file"), controller.addPhoto);

router.route("/me/photo").get(controller.photo);

router.route("/me/photo/:photo_id").get(controller.photo);

router.route("/me/nearby").get(cacheMiddleware("nearby"), controller.nearby);

router.route("/:user_id").get(cacheMiddleware("profile"), controller.profile);

router.route("/:user_id/photo").get(controller.photo);

router.route("/:user_id/photo/:photo_id").get(controller.photo);

module.exports = router;
