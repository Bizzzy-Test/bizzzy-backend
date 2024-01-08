const { messageConstants } = require('../../constants');
const profileService = require('../../service/profile');
const { logger } = require('../../utils');
const { getUserData } = require('../../middleware');

const userProfile = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        let response;
        if (userData.role == 2) {
            response = await profileService.clientProfile(req, userData, res);
        } else {
            response = await profileService.freelancerProfile(req, userData, res);
        }
        logger.info(`${messageConstants.RESPONSE_FROM} Freelancer Profile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`Freelancer Profile ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await profileService.getUserProfile(userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getUserProfile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getUserProfile ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const profileImageUpload = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await profileService.profileImageUpload(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} profileImageUpload API`, JSON.stringify(response));
        if (response != null) {
            res.sendFile(response);
        }
    } catch (err) {
        logger.error(`profileImageUpload ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getProfileImage = async (req, res) => {
    try {
        const response = await profileService.getProfileImage(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getProfileImage API`, JSON.stringify(response));
        if (response != null) {
            res.sendFile(response);
        }

    } catch (err) {
        logger.error(`getProfileImage ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const editProfile = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        // const editProfileService = userData?.role === 1 ? 'editFreelencerProfile' : 'editClientProfile';
        // const response = await profileService[editProfileService](req, userData, res);
        let response;
        if (userData.role == 1) {
            response = await profileService.editFreelancerProfile(req, userData, res);
        } else {
            response = await profileService.editClientProfile(req, userData, res);
        }
        logger.info(`${messageConstants.RESPONSE_FROM} editProfile API`, JSON.stringify(response));
        if (response != null) {
            res.sendFile(response);
        }
    } catch (err) {
        logger.error(`editProfile ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const searchFreelancers = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await profileService.searchFreelencers(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} searchFreelencers API`, JSON.stringify(response));
        if (response != null) {
            res.sendFile(response);
        }
    } catch (err) {
        logger.error(`searchFreelencers ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const deleteExperience = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await profileService.deleteExperience(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} deleteExperience API`, JSON.stringify(response));
        if (response != null) {
            res.sendFile(response);
        }
    } catch (err) {
        logger.error(`deleteExperience ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    userProfile,
    getUserProfile,
    getProfileImage,
    profileImageUpload,
    deleteExperience,
    searchFreelancers,
    editProfile,
    deleteExperience
}