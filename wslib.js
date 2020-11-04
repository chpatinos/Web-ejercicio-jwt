const messageController = require("./controllers/message");
const WebSocket = require("ws");

const clients = [];

const getMessages = (callback) => {
  messageController.wsGetMessages((resp) => {
    callback(resp);
  });
};

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    getMessages((messages) => {
      sendMessages(messages);
    });

    ws.on("message", (message) => {
      if (message.split(";")[0] == "client") messageController.wsCreateMessage({ message: message.split(";")[1], author: message.split(";")[2] });
      getMessages((messages) => {
        sendMessages(messages);
      });
    });
  });

  const sendMessages = () => {
    getMessages((messages) => {
      clients.forEach((client) => client.send(JSON.stringify(messages)));
    });
  };
};

exports.wsConnection = wsConnection;
