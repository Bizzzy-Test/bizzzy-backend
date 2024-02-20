const { validateRequest } = require('../validate-request');
const Joi = require('joi');

const createAgencyValidation = (req, res, next) => {
    const schema = Joi.object({
        agency_name: Joi.string().required(),
        agency_tagline: Joi.string().required(),
        agency_overview: Joi.string().required(),
        agency_profileImage: Joi.string().allow(null),
        agency_coverImage: Joi.string().allow(null),
        agency_hourlyRate: Joi.number().default(0),
        agency_services: Joi.object({
            category: Joi.string().required(),
            subCategory: Joi.string().required(),
        }).required(),
        agency_location: Joi.object().required(),
        // agency_skills: Joi.array().items(Joi.string()),
        agency_totalJob: Joi.number().default(0),
        agency_portfolio: Joi.array().items(Joi.object({
            project_name: Joi.string().required(),
            project_description: Joi.string().required(),
            technologies: Joi.array().items(Joi.string()).required(),
            project_images: Joi.array().items(Joi.string()).required(),
        })),
        agency_officeLocation: Joi.object({
            country: Joi.string().required(),
            state: Joi.string().required(),
            street: Joi.string().required(),
            address: Joi.string().required(),
        }),
        agency_companyInfo: Joi.object({
            agency_size: Joi.string().required(),
            agency_foundedYear: Joi.string().required(),
            agency_focus: Joi.array().items(Joi.string()).required(),
            agency_language: Joi.string().required(),
        })
    })
    validateRequest(req, res, schema, next);
}

const sendInvitationToFreelancerValidation = (req, res, next) => {
    const schema = Joi.object({
        agency_profile: Joi.string().required(),
        message: Joi.string().required(),
        freelancer_id: Joi.string().required(),
        member_position:Joi.string().required()
    })
    validateRequest(req, res, schema, next);
}

module.exports = {
    createAgencyValidation,
    sendInvitationToFreelancerValidation
}