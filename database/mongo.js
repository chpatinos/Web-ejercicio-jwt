const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:22YMaQx9k21fYwQm@cluster0.kbrwt.mongodb.net/WEB?retryWrites=true&w=majority";

const conn = MongoClient.connect(url, { useUnifiedTopology: true });

module.exports = conn;