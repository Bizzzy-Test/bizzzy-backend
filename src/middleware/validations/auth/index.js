const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const signUpValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        country: Joi.string().required(),
        role: Joi.number().valid(1, 2).required(),
        has_accepted_terms: Joi.boolean().required()
    })
    validateRequest(req, res, schema, next);
}
const emailVerifyValidation = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        token: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const signInValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const forgotPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required()
    })
    validateRequest(req, res, schema, next)
}

const changePasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        new_password: Joi.string().required()
    })
    validateRequest(req, res, schema, next)
}

const resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        old_password: Joi.string().required(),
        new_password: Joi.string().required()
    })
    validateRequest(req, res, schema, next)
}

const experienceValidation = (req, res, next) => {
    const schema = Joi.object({
        experienceId: Joi.string().required()
    })
    validateRequest(req, res, schema, next)
}

module.exports = {
    signUpValidation,
    signInValidation,
    forgotPasswordValidation,
    changePasswordValidation,
    resetPasswordValidation,
    emailVerifyValidation,
    experienceValidation
}