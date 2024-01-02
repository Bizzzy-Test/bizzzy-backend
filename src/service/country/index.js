const { model } = require('mongoose');
const { responseData, messageConstants } = require('../../constants');
const CountrySchema = require('../../models/country');
const { logger } = require('../../utils');

const getCountryList = async (req, res) => {
    return new Promise(async () => {
        await CountrySchema.find({}).then(async (result) => {
            return responseData.success(res, result, `Get all countries successfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

module.exports = {
    getCountryList
}