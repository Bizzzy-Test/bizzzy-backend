const api = require("../../controller/offer");
const { urlConstants } = require("../../constants");
const { jsonWebToken, offerValidator } = require("../../middleware");
const upload = require('../../middleware/image_upload');

module.exports = (app) => {
    app.post(urlConstants.OFFER_SEND, jsonWebToken.validateToken, offerValidator.offerValidation, api.sendOffer);
    app.post(urlConstants.OFFER_UPDATE, jsonWebToken.validateToken, api.updateOfferStatus);
    app.get(urlConstants.OFFERS_LIST_GET, jsonWebToken.validateToken, api.getOffersList);
    app.get(urlConstants.FREELANCER_OFFER_DETAILS, jsonWebToken.validateToken, api.getOfferDetails);
    app.get(urlConstants.HIRED_LIST_GET, jsonWebToken.validateToken, api.getHiredList);
    app.get(urlConstants.JOB_HIRED_LIST_GET, jsonWebToken.validateToken, api.getJobHiredList);
    app.get(urlConstants.GET_ACTIVE_JOB_BY_FREELANCER_ID, jsonWebToken.validateToken, api.getAcceptedOfferByFreelancerId);
    app.post(urlConstants.SUBMIT_OFFER_TASK, jsonWebToken.validateToken, upload.single('file'), api.submitOfferTask);
    app.post(urlConstants.END_CONTRACT, jsonWebToken.validateToken, offerValidator.endContractValidation, api.endContract);
}