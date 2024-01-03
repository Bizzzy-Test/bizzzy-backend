const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const offerValidation = (req, res, next) => {
    const schema = Joi.object({
        freelencer_id: Joi.string().required(),
        job_id: Joi.string().required(),
        budget: Joi.number().required()
    })
    validateRequest(req, res, schema, next);
}

const offerUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
        offer_id: Joi.string().required(),
        job_id: Joi.string().required(),
        status: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const endContractValidation = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        job_id: Joi.string().required(),
        status: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const offerTaskSubmitValidation = (req, res, next) => {
    const schema = Joi.object({
        message: Joi.string().required(),
        job_id: Joi.string().required(),
        client_id: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    offerValidation,
    offerUpdateValidation,
    endContractValidation,
    offerTaskSubmitValidation
}