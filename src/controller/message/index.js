const { messageConstants } = require("../../constants");
const { getUserData } = require("../../middleware");
const messageService = require('../../service/message');
const { logger } = require("../../utils");


const getMessageList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await messageService.getMessageList(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getMessageList API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getMessageList ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getChatUserList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await messageService.getChatUserList(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getChatUserList API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getChatUserList ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    getMessageList,
    getChatUserList
}