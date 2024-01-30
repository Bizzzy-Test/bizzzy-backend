const api = require("../../controller/agency");
const { urlConstants } = require("../../constants");
const { jsonWebToken, agencyValidation } = require("../../middleware");

module.exports = (app) => {
    app.post(urlConstants.CREATE_AGENCY, jsonWebToken.validateToken, agencyValidation.createAgencyValidation, api.createAgency);
    app.put(urlConstants.UPDATE_AGENCY, jsonWebToken.validateToken, api.updateAgency);
    app.delete(urlConstants.DELETE_AGENCY, jsonWebToken.validateToken, api.deleteAgency);
    app.get(urlConstants.GET_AGENCY_BY_ID, jsonWebToken.validateToken, api.getAgencyById);
    app.get(urlConstants.GET_AGENCIES, jsonWebToken.validateToken, api.getAllAgency);
    app.get(urlConstants.SEARCH_AGENCY, jsonWebToken.validateToken, api.searchAgency);
    app.get(urlConstants.GET_AGENCY, jsonWebToken.validateToken, api.getAgency);
    app.post(urlConstants.SEND_AGENCY_INVITATION, jsonWebToken.validateToken, agencyValidation.sendInvitationToFreelancerValidation, api.sendInvitationToFreelancer);
    app.put(urlConstants.UPDATE_INVITATION_BY_FREELANCER, jsonWebToken.validateToken, api.updateInvitationByFreelancer);
    app.put(urlConstants.UPDATE_INVITATION_BY_AGENCY, jsonWebToken.validateToken, api.updateInvitationByAgency);
    app.get(urlConstants.GET_INVITATION_STATUS_DATA, jsonWebToken.validateToken, api.getStatusData);
}