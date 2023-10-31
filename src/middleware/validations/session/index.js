const { validateRequest } = require('../validate-request');
const Joi = require('joi');


const createSessionValidation = (req, res, next) => {
    const schema = Joi.object({
        session_slots: Joi.array().items(
            Joi.object({
              time_slots: Joi.array().items(Joi.string()).required(),
            })
          ).required(),
    })
    validateRequest(req, res, schema, next);
}

const bookSessionValidation = (req, res, next) => {
    const schema = Joi.object({
        advisor_id: Joi.string().required(),
        date: Joi.string().required(),
        payment_status: Joi.string().required(),
        amount: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    createSessionValidation,
    bookSessionValidation
}