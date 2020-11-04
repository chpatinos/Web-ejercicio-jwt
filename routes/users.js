const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const express = require("express");

const router = express.Router();

router.route("/login").post(authController.login);

router.use(authController.protect);

router.route("/").get(userController.getAllUsers).post(authController.register);

router.route("/:username").get(userController.getUserByUsername);

module.exports = router;