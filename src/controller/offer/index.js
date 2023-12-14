const { messageConstants } = require("../../constants");
const { getUserData } = require("../../middleware");
const offerService = require('../../service/offer');
const { logger } = require("../../utils");


const sendOffer = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.sendOffer(req.body, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Send offer API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Send offer API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const updateOffer = async (req, res) => {
    try {
        const response = await offerService.updateOffer(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Update offer API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Update offer API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getOffersList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getOffersList(userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get offers List API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get offers List API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getHiredList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getHiredList(userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get hired List API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get hired List API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getAcceptedOfferByFreelancerId = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getAcceptedOfferByFreelancerId(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAcceptedOfferByFreelancerId API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAcceptedOfferByFreelancerId ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

module.exports = {
    sendOffer,
    getOffersList,
    updateOffer,
    getHiredList,
    getAcceptedOfferByFreelancerId
}