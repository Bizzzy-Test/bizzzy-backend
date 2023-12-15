const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const inviteValidation = (req, res, next) => {
    const schema = Joi.object({
        receiver_id: Joi.string().required(),
        message: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const updateInviteValidation = (req, res, next) => {
    const schema = Joi.object({
        invite_id: Joi.string().required(),
        status: Joi.number().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    inviteValidation,
    updateInviteValidation
}