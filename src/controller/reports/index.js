const { messageConstants } = require("../../constants");
const { getUserData, getFileUrl } = require("../../middleware");
const offerService = require('../../service/reports');
const { logger } = require("../../utils");

const getReportData = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getReportData(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get Report Data API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get Report Data API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getAgencyData = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await offerService.getAgencyData(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAgencyData API`, JSON.stringify(response))
    } catch (error) {
        logger.error(`getAgencyData ${messageConstants.API_FAILED} ${error}`)
        res.send(error)
    }
}

module.exports = {
    getReportData,
    getAgencyData
}