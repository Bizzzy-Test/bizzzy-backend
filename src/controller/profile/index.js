const { messageConstants } = require('../../constants');
const profileService = require('../../service/profile');
const { logger } = require('../../utils');
const { getUserData } = require('../../middleware');

const userProfile = async (req, res) => {
    try {
        const response = await profileService.userProfile(req.body, res);
        logger.info(`${messageConstants.RESPONSE_FROM} userProfile API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`UserProfile ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await profileService.getUserProfile(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getUserProfile API`, JSON.stringify(jsonData));
        res.send(response);
    } catch (err) {
        logger.error(`GetUserProfile ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

const getProfileImage = async (req, res) => {
    try {
        const response = await profileService.getProfileImage(req, res);
        if (response != null){
            res.sendFile(response);
        }
        
    } catch (err) {
        logger.error(`getProfileImage ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

module.exports = {
    userProfile,
    getUserProfile,
    getProfileImage,
}