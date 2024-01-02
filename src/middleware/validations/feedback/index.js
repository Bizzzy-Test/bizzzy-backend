const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const postFeedbackValidation = (req, res, next) => {
    const schema = Joi.object({
        job_id: Joi.string().required(),
        sender_id: Joi.string().required(),
        reciever_id: Joi.string().required(),
        public_feedback: Joi.object({
            feedback_message: Joi.string().required(),
            average_rating: Joi.string().required(),
        }).required(),
        private_feedback: Joi.object({
            recommending_others: Joi.number().required(),
            reason_for_ending_contract: Joi.string().required(),
        }).required(),
    })
    validateRequest(req, res, schema, next);
}
module.exports = {
    postFeedbackValidation,
}