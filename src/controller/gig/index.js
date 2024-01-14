const GigService = require("../../service/gig");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { uploadFile, deleteFile } = require("../../middleware/aws/aws.js");
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

const uploadMultipleImage = async (req, res) => {
    try {
        if (req.files.length > 3) {
            logger.error('Max 3 image you can upload');
            return responseData.fail(res, 'Max 3 image you can upload', 500);
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
        const videoUrl = await uploadVideo(req.file, 'Gig Folder');
        logger.info('Video File uploaded successfully');
        return responseData.success(res, videoUrl, 'Video File uploaded successfully');
    } catch (err) {
        logger.error('Internal Server Error');
        return responseData.fail(res, 'Internal Server Error', 500);
    }
};

module.exports = {
    createGig,
    uploadMultipleImage,
    uploadVideoController
};