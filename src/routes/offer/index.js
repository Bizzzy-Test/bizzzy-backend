const api = require("../../controller/offer");
const { urlConstants } = require("../../constants");
const { jsonWebToken, offerValidator } = require("../../middleware");

module.exports = (app) => {
    app.post(urlConstants.OFFER_SEND, jsonWebToken.validateToken, offerValidator.offerValidation, api.sendOffer);
}