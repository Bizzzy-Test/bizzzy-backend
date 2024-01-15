const api = require("../../controller/gig");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const upload = require("../../middleware/image_upload");

module.exports = (app) => {
    app.post(urlConstants.CREATE_GIG, jsonWebToken.validateToken, api.createGig);
    app.post(urlConstants.UPLOAD_MULTIPLE_IMAGE, jsonWebToken.validateToken, upload.array('imageFiles'), api.uploadMultipleImage);
    app.post(urlConstants.UPLOAD_VIDEO, jsonWebToken.validateToken, upload.single('videoFile'), api.uploadVideoController);
    app.get(urlConstants.GET_ALL_GIG, jsonWebToken.validateToken, api.getGig);
    app.get(urlConstants.GET_GIG_BY_USER_ID, jsonWebToken.validateToken, api.getGigByUserId);
    app.get(urlConstants.GET_GIG_BY_GIG_ID, jsonWebToken.validateToken, api.getGigByGigId);
    app.patch(urlConstants.GIG_UPDATE, jsonWebToken.validateToken, api.gigUpdate);
    app.patch(urlConstants.GIG_UPDATE_STATUS, jsonWebToken.validateToken, api.gigStatusUpdate);
    app.delete(urlConstants.GIG_DELETE, jsonWebToken.validateToken, api.gigDelete);
}