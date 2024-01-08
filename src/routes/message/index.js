const api = require("../../controller/message");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");

module.exports = (app) => {
    app.get(urlConstants.MESSAGE_LIST, jsonWebToken.validateToken, api.getMessageList);
    app.get(urlConstants.CHAT_USER_LIST, jsonWebToken.validateToken, api.getChatUserList);
    app.post(urlConstants.DELETE_MESSAGE, jsonWebToken.validateToken, api.deleteMessage);
}