const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/user");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.username);

  res.status(statusCode).json({
    success: true,
    message: "Authentication successful",
    token,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(404).json({ error: "Must provide email and password!" });
  userModel.getUser(username, async (user) => {
    if (!user || !(await bcrypt.compare(password, user[0].password))) return res.status(404).json({ error: "Username or password not valid" });
    createSendToken(user, 200, res);
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(404).json({ error: "You are not logged in! Please log in to get access" });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("Decoded: ", decoded);
  userModel.getUser(decoded.username, (currentUser) => {
    console.log(currentUser);
    if (!currentUser) return res.status(404).json({ error: "The user belonging to this token does not longer exist." });
    if (currentUser.changedPasswordAfter(decoded.iat)) return res.status(404).json({ error: "User recently changed password! Please log in again" });
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(404).json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
};

exports.register = catchAsync(async (req, res, next) => {
  const newUser = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 12),
    role: req.body.role,
  };
  userModel.createUser(newUser, (resp) => {
    if (!resp) return res.status(404).json({ error: "Error creating user!" });
    res.status(201).json({ response: "The user was created correctly.", createdRow: newUser });
  });
});
