const messageController = require("../controllers/message");
const authController = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin", "list"), messageController.getAllMessages)
  .post(authController.restrictTo("admin", "post"), messageController.createMessage)
  .put(authController.restrictTo("admin"), messageController.updateMessage);

router
  .route("/:ts")
  .get(authController.restrictTo("admin", "list"), messageController.getMessageByTs)
  .delete(authController.restrictTo("admin"), messageController.deleteMessage);

module.exports = router;
