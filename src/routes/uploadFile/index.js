const api = require("../../controller/uploadFile");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const upload = require("../../middleware/image_upload");

module.exports = (app) => {
    app.post(urlConstants.UPLOAD_MULTIPLE_IMAGE, jsonWebToken.validateToken, upload.array('imageFiles'), api.uploadMultipleImage);
    app.post(urlConstants.UPLOAD_VIDEO, jsonWebToken.validateToken, upload.single('videoFile'), api.uploadVideoController);
}