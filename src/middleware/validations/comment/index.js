const Joi = require("joi");
const { validateRequest } = require("../validate-request");

const commentValidation = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        comment: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

const replyCommentValidation = (req, res, next) => {
    const schema = Joi.object({
        comment: Joi.string().required(),
        comment_id: Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    commentValidation,
    replyCommentValidation
}