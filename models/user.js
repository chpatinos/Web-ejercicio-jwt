const joi = require("joi");
const mongo = require("../database/mongo");

const schema = joi.object({
  username: joi.string().min(5).required(),
  password: joi.string().min(8).required(),
  role: joi.string().required(),
});

exports.getAllUsers = (callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("users")
      .find({})
      .toArray((err, data) => {
        callback(data);
      });
  });
};

exports.getUser = (username, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("users")
      .find({ username })
      .toArray((err, data) => {
        callback(data);
      });
  });
}

exports.createUser = (user, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("users")
      .insertOne(user)
      .then((resp) => {
        callback(resp);
      });
  });
};

exports.userSchema = schema;