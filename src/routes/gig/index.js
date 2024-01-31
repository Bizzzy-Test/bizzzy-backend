const api = require("../../controller/gig");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const upload = require("../../middleware/image_upload");

module.exports = (app) => {
    app.post(urlConstants.CREATE_GIG, jsonWebToken.validateToken, api.createGig);
    app.get(urlConstants.GET_ALL_GIG, jsonWebToken.validateToken, api.getGig);
    app.get(urlConstants.GET_ALL_APPROVED_GIG, jsonWebToken.validateToken, api.getAllApprovedGig);
    app.get(urlConstants.GET_GIG_BY_USER_ID, api.getGigByUserId);
    app.get(urlConstants.GET_GIG_BY_GIG_ID, jsonWebToken.validateToken, api.getGigByGigId);
    app.patch(urlConstants.GIG_UPDATE, jsonWebToken.validateToken, api.gigUpdate);
    app.patch(urlConstants.GIG_UPDATE_STATUS, jsonWebToken.validateToken, api.gigStatusUpdate);
    app.delete(urlConstants.GIG_DELETE, jsonWebToken.validateToken, api.gigDelete);
}