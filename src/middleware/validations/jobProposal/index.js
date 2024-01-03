const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const jobProposalCreateValidation = (req, res, next) => {
    const schema = Joi.object({
        coverLetter: Joi.string().required(),
        jobType: Joi.string().required(),
        desiredPrice: Joi.number().required(),
        jobId: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    jobProposalCreateValidation
}