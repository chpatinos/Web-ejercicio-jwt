const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const logger = require("morgan");
const path = require("path");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const messageRouter = require("./routes/message");

const app = express();

dotenv.config({
  path: "./config.env",
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat/api/messages', messageRouter);

module.exports = app;
