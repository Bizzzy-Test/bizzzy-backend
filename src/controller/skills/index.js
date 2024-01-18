const { messageConstants } = require("../../constants");
const { getUserData, getFileUrl } = require("../../middleware");
const skillsService = require('../../service/skills');
const { logger } = require("../../utils");

const getAllCategories = async (req, res) => {
    try {
        const response = await skillsService.getAllCategories(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAllCategories API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAllCategories API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

// const addSubCategory = async (req, res) => {
//     try {
//         const response = await skillsService.addSubCategory(req, res);
//         logger.info(`${messageConstants.RESPONSE_FROM} addSubCategory API`, JSON.stringify(response));
//         res.send(response);
//     } catch (err) {
//         logger.error(`addSubCategory API ${messageConstants.API_FAILED} ${err}`);
//         res.send(err);
//     }
// }

const getSubCategory = async (req, res) => {
    try {
        const response = await skillsService.getSubCategory(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getSubCategory API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getSubCategory API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}
// const addSkills = async (req, res) => {
//     try {
//         const response = await skillsService.addSkills(req, res);
//         logger.info(`${messageConstants.RESPONSE_FROM} addSkills API`, JSON.stringify(response));
//         res.send(response);
//     } catch (err) {
//         logger.error(`addSkills API ${messageConstants.API_FAILED} ${err}`);
//         res.send(err);
//     }
// }
const getSkillsOfCategory = async (req, res) => {
    try {
        const response = await skillsService.getSkillsOfCategory(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getSkillsOfCategory API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getSkillsOfCategory API ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    getAllCategories,
    // addSkills,
    getSkillsOfCategory,
    // addSubCategory,
    getSubCategory
}