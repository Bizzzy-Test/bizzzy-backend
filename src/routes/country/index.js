const countryAPI = require("../../controller/country")
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");

module.exports = (app) => {
    app.get(urlConstants.LIST_COUNTRIES, countryAPI.getCountryList);
}