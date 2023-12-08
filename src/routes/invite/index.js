const api = require("../../controller/invite");
const { urlConstants } = require("../../constants");
const { jsonWebToken, inviteValidator } = require("../../middleware");

module.exports = (app) => {
    app.post(urlConstants.SEND_INVITATION, jsonWebToken.validateToken, inviteValidator.inviteValidation, api.sendInvitation);
    app.put(urlConstants.UPDATE_INVITATION_STATUS, jsonWebToken.validateToken, inviteValidator.updateInviteValidation, api.updateInvitation);
    app.get(urlConstants.CLIENT_INVITATION_DETAILS, jsonWebToken.validateToken, api.getInvitationDetails);
    app.get(urlConstants.GET_INVITED_FREELANCERS_LIST, jsonWebToken.validateToken, api.getInvitedFreelancers);
    app.get(urlConstants.FREELANCER_INVITATION_DETAILS, jsonWebToken.validateToken, api.getInvitationDetailForFreelancer);
}