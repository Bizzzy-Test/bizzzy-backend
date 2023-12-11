const { messageConstants } = require("../constants");
const { logger } = require("../utils");
const SocketSchema = require('../models/socket');

const connectUser = async (socket) => {
    return new Promise(async (resolve, reject) => {
        try {
            socket.on('connect_user', async (data) => {
                logger.info(`Data received during user connect ${JSON.stringify(data)}`);
                const socketData = await SocketSchema.find({ user_id: data.user_id });
                if (socketData.length !== 0) {
                    // Update socket if user already exist
                    await updateSocket(socket, socketData);
                } else {
                    // Create socket connection if user not exist
                    await createSocket(data, socket);
                }
                await socket.emit('connect_user', socket.id);
                return resolve();
            })
        } catch (err) {
            logger.error(`${messageConstants.NOTIFICATION_CREATION_FAILED} ${err}`);
            return reject(err);
        }
    })
}

const disconnectUser = (socket) => {
    return new Promise(async (resolve, reject) => {
        try {
            socket.on('disconnect', () => {
                logger.info(`User ${socket.id} disconnected`);
                return resolve();
            })
        } catch (err) {
            logger.error(`${messageConstants.NOTIFICATION_CREATION_FAILED} ${err}`);
            return reject(err);
        }
    })
}

const updateSocket = async (socket, socketData) => {
    return new Promise(async (resolve, reject) => {
        try {
            await SocketSchema.updateOne({
                user_id: socketData[0]['user_id']
            }, { $set: { socket_id: socket.id } }).then((result) => {
                logger.info(`Socket updated succesfully for user id ${socketData[0]['user_id']} with socket id ${socket.id}`);
                return resolve(result);
            })
        } catch (err) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR} ${err}`);
            return reject(err);
        }
    })

}

const createSocket = async (data, socket) => {
    return new Promise(async (resolve, reject) => {
        try {
            data['socket_id'] = socket.id;
            const socketSchema = new SocketSchema(data);
            await socketSchema.save().then(async (result) => {
                logger.info(`Socket created succesfully for user id ${result['user_id']} with socket id ${socket.id}`);
                return resolve(result);
            })
        } catch (err) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR} ${err}`);
            return reject(err);
        }
    })

}


module.exports = {
    connectUser,
    disconnectUser
}