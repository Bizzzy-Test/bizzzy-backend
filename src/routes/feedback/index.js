const { urlConstants } = require("../../constants");
const { jsonWebToken, feedbackValidator } = require("../../middleware");
const feedbackApi = require("../../controller/feedback")

module.exports = (app) => {
    app.post(urlConstants.POST_FEEDBACK, jsonWebToken.validateToken, feedbackValidator.postFeedbackValidation, feedbackApi.postFeedback);
    app.get(urlConstants.GET_FEEDBACK, jsonWebToken.validateToken, feedbackApi.getFeedback);
}