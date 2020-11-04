const userModel = require("../models/user");

exports.getAllUsers = (req, res, next) => {
  userModel.getAllUsers((resp) => {
    res.status(200).send(resp);
  });
};

exports.getUserByUsername = (req, res, next) => {
  if (!req.params.username) return res.status(404).send("Please provide a username to find.");
  userModel.getUser(req.params.username, (resp) => {
    if (!resp || !resp[0]) return res.status(404).send("The user with the given username was not found.");
    res.status(200).send(resp[0]);
  });
};

exports.deleteUser = (req, res, next) => {
  let username = req.params.username;
  if (!username) return res.status(404).send("Please provide a username for delete.");
  userModel.getUser(username, (resp) => {
    if (!resp || !resp[0]) return res.status(404).send("The user with the given username was not found.");
    userModel.deleteUser(username, (resp) => {
      res.status(200).json({
        success: true,
        message: "User with username " + username + " successfully deleted."
      });
    });
  });
};
