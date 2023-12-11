const { messageConstants } = require("../constants");
const SocketSchema = require("../models/socket");
const { logger } = require("../utils");
const MessageSchema = require('../models/message');

const createMessage = async (data) => {
    console.log({ "----": data });
    return new Promise(async (resolve, reject) => {
        try {
            const messageSchema = new MessageSchema(data);
            await messageSchema.save().then((result) => {
                logger.info(messageConstants.MESSAGE_SAVED_SUCCESSFULLY);
                return resolve(result);
            })
        } catch (err) {
            logger.error(`${messageConstants.MESSAGE_CREATION_FAILED} ${err}`);
            return reject(err);
        }
    })
}

const handleChat = async (data, socket, io) => {
    logger.info(`Data received in chat_message ${data.receiver_id}`);
    const receiverSocketData = await SocketSchema.find({ user_id: data.receiver_id });
    const saveMessage = await createMessage(data);
    if (saveMessage) {
        io.to(socket.id).emit('chat_message', saveMessage);
        if (receiverSocketData.length > 0) {
            io.to(receiverSocketData[0]['socket_id']).emit('chat_message', saveMessage);
        } else {
            logger.error(messageConstants.RECEIVER_NOT_FOUND);
            io.to(socket.id).emit('chat_message', messageConstants.RECEIVER_NOT_FOUND);
        }
        return saveMessage['_id'];
    } else {
        logger.error(messageConstants.MESSAGE_NOT_SENT);
        io.to(socket.id).emit('chat_message', messageConstants.MESSAGE_NOT_SENT);
        io.to(receiverSocketData[0]['socket_id']).emit('chat_message', messageConstants.MESSAGE_NOT_SENT);
    }
}

module.exports = {
    handleChat
}