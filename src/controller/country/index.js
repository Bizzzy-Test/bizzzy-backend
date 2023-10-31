const countryService = require('../../service/country');
const { logger } = require('../../utils');

const getCountryList = async (req, res) => {
    try {
        const response = await countryService.getCountryList(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getCountryList API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getCountryList ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}
module.exports = {
    getCountryList
}