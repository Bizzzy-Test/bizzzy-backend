
const { connectUser, disconnectUser } = require('./utils');
const { handleChat } = require('./chat');

module.exports = (io) => {
    io.on('connection', async (socket) => {
        connectUser(socket);
        socket.on('chat_message', async (data) => {
          console.log(data);
          handleChat(data, socket, io);
        })
        disconnectUser(socket);
    })
}