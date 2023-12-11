const api = require("../../controller/offer");
const { urlConstants } = require("../../constants");
const { jsonWebToken, offerValidator } = require("../../middleware");

module.exports = (app) => {
    app.post(urlConstants.OFFER_SEND, jsonWebToken.validateToken, offerValidator.offerValidation, api.sendOffer); 
    app.post(urlConstants.OFFER_UPDATE, jsonWebToken.validateToken, offerValidator.offerUpdateValidation, api.updateOffer); 
    app.get(urlConstants.OFFERS_LIST_GET, jsonWebToken.validateToken, api.getOffersList);
    app.get(urlConstants.HIRED_LIST_GET, jsonWebToken.validateToken, api.getHiredList);
}