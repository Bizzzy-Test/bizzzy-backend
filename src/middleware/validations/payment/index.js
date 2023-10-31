const { validateRequest } = require('../validate-request');
const Joi = require('joi');


const paymentValiation = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        stripe_customer_id: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

const checkoutPaymentValiation = (req, res, next) => {
    const schema = Joi.object({
        date: Joi.string().required(),
        time: Joi.string().required(),
        advisorName: Joi.string().required(),
        rate: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

const checkoutSubscriptionValidation = (req, res, next) => {
    const schema = Joi.object({
        priceId: Joi.string().required(),
        userId: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    paymentValiation,
    checkoutPaymentValiation,
    checkoutSubscriptionValidation
}