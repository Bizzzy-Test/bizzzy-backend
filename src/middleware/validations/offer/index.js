const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const offerValidation = (req, res, next) => {
    const schema = Joi.object({
        freelencer_id: Joi.string().required(),
        job_id: Joi.string().required(),
        budget: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    offerValidation
}