const api = require("../../controller/gig");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const upload = require("../../middleware/image_upload");

module.exports = (app) => {
    app.post(urlConstants.CREATE_GIG, jsonWebToken.validateToken, api.createGig);
    app.post(urlConstants.UPLOAD_MULTIPLE_IMAGE, upload.array('imageFiles'), api.uploadMultipleImage);
    app.post(urlConstants.UPLOAD_VIDEO, upload.single('videoFile'), api.uploadVideoController);
}