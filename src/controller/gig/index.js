const GigService = require("../../service/gig");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { getUserData, getMultipleFileUrls, uploadVideo } = require("../../middleware/index.js");
const responseData = require("../../constants/responses.js");

// ==== create job post ==== controller

const createGig = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await GigService.createGig(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} createGig API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createGig ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getGig = async (req, res) => {
    try {
        const response = await GigService.getGig(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getGig API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getGig ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getGigByUserId = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await GigService.getGigByUserId(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getGigByUserId API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getGigByUserId ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getGigByGigId = async (req, res) => {
    try {
        const response = await GigService.getGigByGigId(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getGigByGigId API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getGigByGigId ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const gigDelete = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await GigService.gigDelete(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} gigDelete API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`gigDelete ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const gigUpdate = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await GigService.gigUpdate(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} gigUpdate API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`gigUpdate ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const gigStatusUpdate = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await GigService.gigStatusUpdate(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} gigStatusUpdate API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`gigStatusUpdate ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const uploadMultipleImage = async (req, res) => {
    try {
        const MAX_IMAGE_SIZE_MB = 10;
        const invalidImages = req.files.filter(file => file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);
        if (req.files.length > 3) {
            logger.error('Max 3 image you can upload');
            return responseData.fail(res, 'Max 3 image you can upload', 500);
        } else if (invalidImages.length > 0) {
            logger.error(`Image(s) exceed the maximum size of ${MAX_IMAGE_SIZE_MB}MB`);
            return responseData.fail(res, `Image(s) exceed the maximum size of ${MAX_IMAGE_SIZE_MB}MB`, 400);
        } else {
            const imageUrls = await getMultipleFileUrls(req.files, 'Gig Folder');
            logger.info('Image File uploaded successfully');
            return responseData.success(res, imageUrls, 'Image File uploaded successfully');
        }
    } catch (err) {
        logger.error('Internal Server Error');
        return responseData.fail(res, 'Internal Server Error', 500);
    }
};
const uploadVideoController = async (req, res) => {
    try {
        const videoSize = req?.file?.size;
        const MAX_VIDEO_SIZE_MB = 100;
        if (videoSize > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            logger.error(`Video exceeds the maximum size of ${MAX_VIDEO_SIZE_MB}MB`);
            return responseData.fail(res, `Video exceeds the maximum size of ${MAX_VIDEO_SIZE_MB}MB`, 400);
        } else {
            const videoUrl = await uploadVideo(req.file, 'Gig Folder');
            logger.info('Video File uploaded successfully');
            return responseData.success(res, videoUrl, 'Video File uploaded successfully');
        }
    } catch (err) {
        logger.error('Internal Server Error');
        return responseData.fail(res, 'Internal Server Error', 500);
    }
};

module.exports = {
    createGig,
    uploadMultipleImage,
    uploadVideoController,
    getGig,
    getGigByUserId,
    getGigByGigId,
    gigDelete,
    gigUpdate,
    gigStatusUpdate
};