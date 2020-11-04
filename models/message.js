const joi = require("joi");
const mongo = require("../database/mongo");

const schema = joi.object({
  message: joi.string().min(5).required(),
  author: joi.string().required().pattern(new RegExp("^[a-zA-Z]+ [a-zA-Z]+$")),
  ts: joi.number(),
});

exports.getMessages = (callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("messages")
      .find({})
      .toArray((err, data) => {
        callback(data);
      });
  });
};

exports.getMessagesByTs = (ts, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("messages")
      .find({ ts: parseInt(ts) })
      .toArray((err, data) => {
        callback(data);
      });
  });
};

exports.createMessage = (message, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("messages")
      .insertOne(message)
      .then((resp) => {
        callback(resp);
      });
  });
};

exports.updateMessage = (ts, message, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("messages")
      .updateOne({ ts: parseInt(ts) }, { $set: message })
      .then((resp) => {
        callback(resp);
      });
  });
};

exports.deleteMessage = (ts, callback) => {
  mongo.then((client) => {
    client
      .db("WEB")
      .collection("messages")
      .deleteOne({ ts: parseInt(ts) })
      .then((resp) => {
        callback(resp);
      });
  });
}

exports.messageSchema = schema;
