const fs = require("fs");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3000");
const messageModel = require("../models/message");

/* Util Methods */

const buildMessage = (message) => {
  let newMessage = {
    message: message.message,
    author: message.author,
    ts: new Date().getTime(),
  };
  return newMessage;
};

const addMessage = (message) => {
  newMessage = buildMessage(message);
  messageModel.createMessage(newMessage, (resp) => {
    ws.send("");
  });
};

/* Web Socket Methods */

exports.wsGetMessages = messageModel.getMessages;
exports.wsCreateMessage = addMessage;

/* HTTP Methods */

exports.getAllMessages = (req, res, next) => {
  messageModel.getMessages((resp) => {
    res.status(200).send(resp);
  });
};

exports.getMessageByTs = (req, res, next) => {
  messageModel.getMessagesByTs(req.params.ts, (resp) => {
    if (!resp || !resp[0]) return res.status(404).send("The message with the given ts was not found.");
    res.status(200).send(resp[0]);
  });
};

exports.createMessage = (req, res, next) => {
  const { error } = messageModel.messageSchema.validate(req.body);
  if (error) return res.status(400).send(error);
  newMessage = buildMessage(req.body);
  messageModel.createMessage(buildMessage(newMessage), (resp) => {
    res.status(201).send({ response: "The message was created correctly.", createdRow: newMessage });
    ws.send("");
  });
};

exports.updateMessage = (req, res, next) => {
  const { error } = messageModel.messageSchema.validate(req.body);
  if (error) return res.status(400).send(error);
  messageModel.getMessagesByTs(req.body.ts, (message) => {
    if (!message || !message[0]) return res.status(404).send("The message with the given ts was not found.");
    messageModel.updateMessage(req.body.ts, { message: req.body.message, author: req.body.author }, (resp) => {
      res.status(200).send({ response: "The message was updated correctly.", updatedRow: { ...message[0], ...{ message: req.body.message, author: req.body.author } } });
      ws.send("");
    });
  });
};

exports.deleteMessage = (req, res, next) => {
  messageModel.getMessagesByTs(req.params.ts, (message) => {
    if (!message || !message[0]) return res.status(404).send("The message with the given ts was not found.");
    messageModel.deleteMessage(req.params.ts, (resp) => {
      res.status(200).send({ response: "The message was deleted correctly.", deletedRow: message });
      ws.send("");
    });
  });
};
