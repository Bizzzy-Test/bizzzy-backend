const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const offerValidation = (req, res, next) => {
    const schema = Joi.object({
        freelencer_id: Joi.string().required(),
        job_id: Joi.string().required(),
        contract_title: Joi.string().required(),
        budget: Joi.string().required(),
        category: Joi.string().required(),
        client_message: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    offerValidation
}