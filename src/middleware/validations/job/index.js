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

const jobCreateValidation = (req, res, next) => {
    const schema = Joi.object({
        experience: Joi.string().valid('Entry', 'Intermediate', 'Expert').required(),
        amount: Joi.number().required(),
        budget: Joi.number().required(),
        description: Joi.string().required(),
        title: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

const jobCloseValidation = (req, res, next) => {
    const schema = Joi.object({
        job_id: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}


module.exports = {
    jobSerachValidation,
    jobCreateValidation,
    jobCloseValidation
}