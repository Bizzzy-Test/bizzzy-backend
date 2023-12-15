const { urlConstants } = require("../../constants");
const { authValidator, jsonWebToken } = require("../../middleware");
const api = require('../../controller/auth');
const profileAPI = require('../../controller/profile');
const userAPI = require("../../controller/user")
const upload = require('../../middleware/image_upload');

module.exports = (app) => {
    app.post(urlConstants.USER_REGISTER, authValidator.signUpValidation, api.signUp);
    app.post(urlConstants.VERIFY_EMAIL, authValidator.emailVerifyValidation, api.verifyEmail);
    app.post(urlConstants.RESEND_VERIFY_EMAIL, authValidator.emailVerifyValidation, api.resendEmailVerification);
    app.post(urlConstants.USER_LOGIN, authValidator.signInValidation, api.signIn);
    
    //TODO Refresh Token
    app.post(urlConstants.REFRESH_TOKEN, authValidator.signInValidation, api.signIn);
    app.post(urlConstants.PROFILE_DETAILS, jsonWebToken.validateToken, upload.array("file"), profileAPI.userProfile);
    app.put(urlConstants.EDIT_PROFILE, jsonWebToken.validateToken, upload.array("file"), profileAPI.editProfile);
    app.delete(urlConstants.DELETE_EXPERIENCE, jsonWebToken.validateToken, authValidator.experienceValidation, profileAPI.deleteExperience);
    app.post(urlConstants.USER_PROFILE_IMAGE, jsonWebToken.validateToken, upload.single('file'), profileAPI.profileImageUpload);
    app.post(urlConstants.SEARCH_FREELENCERS, jsonWebToken.validateToken, profileAPI.searchFreelencers);
    // app.get(urlConstants.GET_SKILLS, jsonWebToken.validateToken, profileAPI.getAllSkills);
    app.get(urlConstants.GET_INVITED_FREELANCERS, jsonWebToken.validateToken, profileAPI.getInvitedFreelancers);

    app.post(urlConstants.UPLOAD_IMAGE + "/:user_id", upload.single('image'), userAPI.uploadImage);
    app.get(urlConstants.GET_USER_BY_ID, jsonWebToken.validateToken, userAPI.getUserById);
    app.get(urlConstants.GET_USER_LIST, jsonWebToken.validateToken, userAPI.getUserList);
    app.get(urlConstants.GET_OPTIONS_LIST, jsonWebToken.validateToken, userAPI.getOptionsList);
    app.get(urlConstants.GET_USER_PROFILE, jsonWebToken.validateToken, profileAPI.getUserProfile);
    app.post(urlConstants.FORGOT_PASSWORD, authValidator.forgotPasswordValidation, userAPI.forgotPassword);
    app.post(urlConstants.CHANGE_PASSWORD, jsonWebToken.validateToken, authValidator.changePasswordValidation, userAPI.changePassword);
    app.post(urlConstants.RESET_PASSWORD, jsonWebToken.validateToken, authValidator.resetPasswordValidation, userAPI.resetPassword);
    app.get(urlConstants.GET_PROFILE_IMAGE + "/:profile_image", jsonWebToken.validateToken, profileAPI.getProfileImage);
}