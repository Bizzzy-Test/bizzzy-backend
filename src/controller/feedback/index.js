const { messageConstants } = require('../../constants');
const { getUserData } = require('../../middleware');
const feedbackService = require('../../service/feedback');
const { logger } = require('../../utils');

const postFeedback = async (req, res) => {
    try {
        const response = await feedbackService.postFeedback(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} postFeedback API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`postFeedback ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getFeedback = async (req, res) => {
    try {
        const userData = await getUserData(req, res)
        const response = await feedbackService.getFeedback(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getFeedback API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getFeedback ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    postFeedback,
    getFeedback
}