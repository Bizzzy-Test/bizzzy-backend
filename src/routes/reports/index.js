const api = require("../../controller/reports");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");

module.exports = (app) => {
    app.get(urlConstants.GET_REPORT_DATA, jsonWebToken.validateToken, api.getReportData);
    app.get(urlConstants.GET_AGENCY_DATA, jsonWebToken.validateToken, api.getAgencyData);
}