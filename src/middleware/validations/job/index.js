const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const jobSerachValidation = (req, res, next) => {
    const schema = Joi.object({
        experience: Joi.string().valid('Entry', 'Intermediate', 'Expert'),
        budget: Joi.string().required(),
        skills: Joi.array().required(),
        category: Joi.array().required(),
    })
    validateRequest(req, res, schema, next);
}
module.exports = {
    jobSerachValidation,
}