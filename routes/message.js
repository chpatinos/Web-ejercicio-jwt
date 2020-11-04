const messageController = require("../controllers/message");
const authController = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.use(authController.protect);

router.route("/")
  .get(messageController.getAllMessages)
  .post(messageController.createMessage)
  .put(messageController.updateMessage);

router.route("/:ts")
  .get(messageController.getMessageByTs)
  .delete(messageController.deleteMessage);

module.exports = router;
