const AgencyService = require("../../service/agency");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { getUserData } = require("../../middleware/index.js");

const createAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.createAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} createAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const updateAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.updateAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`updateAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const deleteAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.deleteAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} deleteAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`deleteAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getAgencyById = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAgencyById(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAgencyById API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAgencyById ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get agency API`, JSON.stringify(response))
    } catch (error) {
        logger.error(`get agency ${messageConstants.API_FAILED} ${error}`)
        res.send(error)
    }
}

module.exports = {
    createAgency,
    updateAgency,
    deleteAgency,
    getAgencyById,
    getAgency
};