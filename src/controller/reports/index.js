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

module.exports = {
    getReportData
}