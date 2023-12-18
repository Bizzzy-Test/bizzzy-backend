const { urlConstants } = require("../../constants");
const { authValidator, jsonWebToken } = require("../../middleware");
const profileAPI = require('../../controller/profile');
const userAPI = require("../../controller/user")
const upload = require('../../middleware/image_upload');

module.exports = (app) => {
    app.post(urlConstants.PROFILE_DETAILS, jsonWebToken.validateToken, upload.array("file"), profileAPI.userProfile);
    app.put(urlConstants.EDIT_PROFILE, jsonWebToken.validateToken, upload.array("file"), profileAPI.editProfile);
    app.delete(urlConstants.DELETE_EXPERIENCE, jsonWebToken.validateToken, authValidator.experienceValidation, profileAPI.deleteExperience);
    app.post(urlConstants.USER_PROFILE_IMAGE, jsonWebToken.validateToken, upload.single('file'), profileAPI.profileImageUpload);
    app.post(urlConstants.UPLOAD_IMAGE + "/:user_id", upload.single('image'), userAPI.uploadImage);
    app.get(urlConstants.GET_USER_PROFILE, jsonWebToken.validateToken, profileAPI.getUserProfile);
    app.get(urlConstants.GET_PROFILE_IMAGE + "/:profile_image", jsonWebToken.validateToken, profileAPI.getProfileImage);
}