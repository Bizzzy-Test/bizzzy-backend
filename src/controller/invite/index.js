const { messageConstants } = require('../../constants');
const { getUserData } = require('../../middleware');
const invitationService = require('../../service/invite');
const { logger } = require('../../utils');

const sendInvitation = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await invitationService.sendInvitation(req.body, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} sendInvitation API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Send Invitation ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const updateInvitation = async (req, res) => {
    try {
        const response = await invitationService.updateInvitationStatus(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Update Invitation Status API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Update Invitation ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getInvitationDetails = async (req, res) => {
    try {
        const response = await invitationService.getInvitationDetails(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get Invitation List API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get Invitation List ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

// const getAllSkills = async (req, res) => {
//     try {
//         const userData = await getUserData(req, res);
//         const response = await invitationService.getAllSkills(userData, res);
//         logger.info(`${messageConstants.RESPONSE_FROM} Get All Skills API`, JSON.stringify(response));
//         res.send(response);
//     } catch (err) {
//         logger.error(`Get Invited Freelencers List ${messageConstants.API_FAILED} ${err}`);
//         res.send(err);
//     }
// }

const getInvitedFreelancers = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await invitationService.getInvitedFreelancers(userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Get Invited Freelencers API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Get Invited Freelencers List ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    sendInvitation,
    updateInvitation,
    getInvitationDetails,
    getInvitedFreelancers,
    // getAllSkills
}