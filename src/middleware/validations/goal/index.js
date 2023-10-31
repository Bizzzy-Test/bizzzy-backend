const Joi = require("joi");
const { validateRequest } = require("../validate-request");

const goalValidation = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        description: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

const updateGoalValidation = (req, res, next) => {
    const schema = Joi.object({
        goal_id: Joi.string().required(),
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    goalValidation,
    updateGoalValidation,
}