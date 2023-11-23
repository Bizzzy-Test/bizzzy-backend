const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const dashboardApi = require("../../controller/dashboard")

module.exports = (app) => {
    app.get(urlConstants.GET_JOB_POST_FOR_DASHBOARD, jsonWebToken.validateToken, dashboardApi.getJobForDashboard);
}