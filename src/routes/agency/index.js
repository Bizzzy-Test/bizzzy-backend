const api = require("../../controller/agency");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");

module.exports = (app) => {
    app.post(urlConstants.CREATE_AGENCY, jsonWebToken.validateToken, api.createAgency);
    app.put(urlConstants.UPDATE_AGENCY, jsonWebToken.validateToken, api.updateAgency);
    app.delete(urlConstants.DELETE_AGENCY, jsonWebToken.validateToken, api.deleteAgency);
    app.get(urlConstants.GET_AGENCY_BY_ID, jsonWebToken.validateToken, api.getAgencyById);
}