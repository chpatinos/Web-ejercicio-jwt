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

const buildUser = async(user) => {
  return {
    username: user.username,
    password: await bcrypt.hash(user.password, 12),
    role: user.role,
  }
}

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(404).json({ error: "Must provide email and password!" });
  userModel.getUser(username, async (user) => {
    if (!user || !(await bcrypt.compare(password, user[0].password))) return res.status(404).json({ error: "Username or password not valid" });
    createSendToken(user[0], 200, res);
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(404).json({ error: "You are not logged in! Please log in to get access" });
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  userModel.getUser(decoded.username, (currentUser) => {
    if (!currentUser[0]) return res.status(404).json({ error: "The user belonging to this token does not longer exist." });
    req.user = currentUser[0];
    next();
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(404).json({ error: "You do not have permission to perform this action" });
    next();
  };
};

exports.register = catchAsync(async (req, res, next) => {
  let body = req.body
  userModel.getUser(req.body.username, async (resp) => {
    if (resp.length > 0) return res.status(404).json({ error: "This username is already taken" });
    let newUser = await buildUser(body);
    userModel.createUser(newUser, (resp) => {
      if (!resp) return res.status(404).json({ error: "Error creating user!" });
      res.status(201).json({ response: "The user was created correctly.", createdRow: newUser });
    });
  });
});
