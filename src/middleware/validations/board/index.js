const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const boardValidation = (req, res, next) => {
    const schema = Joi.object({
        advisor_id: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    boardValidation,
}