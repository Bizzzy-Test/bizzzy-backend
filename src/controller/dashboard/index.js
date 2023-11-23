const { messageConstants } = require('../../constants');
const dashboardService = require('../../service/dashboard');
const { logger } = require('../../utils');

const getJobForDashboard = async (req, res) => {
    try {
        const response = await dashboardService.getJobForDashboard(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getJobForDashboard API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getJobForDashboard ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    getJobForDashboard
}