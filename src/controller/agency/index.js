const AgencyService = require("../../service/agency");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { getUserData } = require("../../middleware/index.js");

const createAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.createAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} createAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const createAgencyProject = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.createProject(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Create Project API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const updateAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.updateAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`updateAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const deleteAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.deleteAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} deleteAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`deleteAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getAgencyById = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAgencyById(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAgencyById API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAgencyById ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getAllAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAllAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAllAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAllAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const searchAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.searchAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} searchAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`searchAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} get agency API`, JSON.stringify(response))
    } catch (error) {
        logger.error(`get agency ${messageConstants.API_FAILED} ${error}`)
        res.send(error)
    }
}

const sendInvitationToFreelancer = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.sendInvitationToFreelancer(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} sendInvitationToFreelancer API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`sendInvitationToFreelancer ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const updateInvitationByFreelancer = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.updateInvitationByFreelancer(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateInvitationByFreelancer API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`updateInvitationByFreelancer ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};
const updateInvitationByAgency = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.updateInvitationByAgency(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateInvitationByAgency API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`updateInvitationByAgency ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getStatusData = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getStatusData(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getStatusData API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getStatusData ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getAgencyJobs = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await AgencyService.getAgencyJobs(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAgencyJobs API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAgencyJobs ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

module.exports = {
    createAgency,
    createAgencyProject,
    updateAgency,
    deleteAgency,
    getAgencyById,
    getAgency,
    sendInvitationToFreelancer,
    updateInvitationByFreelancer,
    updateInvitationByAgency,
    getStatusData,
    getAllAgency,
    searchAgency,
    getAgencyJobs
};