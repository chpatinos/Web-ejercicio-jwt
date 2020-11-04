const userModel = require("../models/user");

exports.getAllUsers = (req, res, next) => {
  userModel.getAllUsers((resp) => {
    res.status(200).send(resp);
  });
};

exports.getUserByUsername = (req, res, next) => {
  console.log(req.params);
  userModel.getUser(req.params.username, (resp) => {
    if (!resp || !resp[0]) return res.status(404).send("The user with the given username was not found.");
    res.status(200).send(resp[0]);
  });
};