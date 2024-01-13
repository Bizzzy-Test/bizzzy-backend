const { jobTypes, experienceType } = require('../../../constants/enum');
const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const jobCreateValidation = (req, res, next) => {
    const schema = Joi.object({
        experience: Joi.string().valid(experienceType.ENTRY, experienceType.INTERMEDIATE, experienceType.EXPERT).required(),
        job_type: Joi.string().valid(jobTypes.HOURLY, jobTypes.FIXED).required(),
        skills: Joi.array().required(),
        // category: Joi.array().required(),
    })
    validateRequest(req, res, schema, next);
}

const jobSerachValidation = (req, res, next) => {
    const schema = Joi.object({
        experience: Joi.string().valid(experienceType.ENTRY, experienceType.INTERMEDIATE, experienceType.EXPERT),
        job_type: Joi.string().valid(jobTypes.HOURLY, jobTypes.FIXED).required(),
        skills: Joi.array().required(),
        category: Joi.array().required(),
    })
    validateRequest(req, res, schema, next);
}
module.exports = {
    jobSerachValidation,
    jobCreateValidation
}