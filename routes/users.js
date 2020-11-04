const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const express = require("express");

const router = express.Router();

router.route("/login").post(authController.login);

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin", "list"), userController.getAllUsers)
  .post(authController.restrictTo("admin", "post"), authController.register);

router
  .route("/:username")
  .get(authController.restrictTo("admin", "list"), userController.getUserByUsername)
  .delete(authController.restrictTo("admin"), userController.deleteUser);

module.exports = router;
