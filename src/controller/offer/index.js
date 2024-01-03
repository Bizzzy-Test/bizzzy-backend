const { messageConstants } = require("../../constants");
const { getUserData, getFileUrl } = require("../../middleware");
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

const updateOfferStatus = async (req, res) => {
    try {
        const response = await offerService.updateOfferStatus(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateOfferStatus API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`updateOfferStatus ${messageConstants.API_FAILED} ${err}`);
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

const getOfferDetails = async (req, res) => {
    try {
        const response = await offerService.getOfferDetails(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get Offer Details API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get Offer Details ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getHiredList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getHiredList(userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get all hired List API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get all hired List API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getJobHiredList = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getJobHiredList(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get hired List API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get hired List API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getUserJobs = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getUsersJobs(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} User Jobs API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`User Jobs API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const submitOfferTask = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const taskFile = await getFileUrl(req);
        const response = await offerService.submitOfferTask(req, userData, taskFile, res);
        logger.info(`${messageConstants.RESPONSE_FROM} submitOfferTask API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`submitOfferTask ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const endContract = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.endContract(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} endContract API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`endContract ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

module.exports = {
    sendOffer,
    getOffersList,
    updateOfferStatus,
    getHiredList,
    getJobHiredList,
    getUserJobs,
    submitOfferTask,
    getOfferDetails,
    endContract
}