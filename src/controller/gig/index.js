const GigService = require("../../service/gig");
const GigSchema = require("../../models/gig")
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { getUserData, getMultipleFileUrls, uploadVideo } = require("../../middleware/index.js");
const responseData = require("../../constants/responses.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
        const userData = await getUserData(req, res);
        const response = await GigService.getGig(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getGig API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getGig ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};
const getAllApprovedGig = async (req, res) => {
    try {
        const response = await GigService.getAllApprovedGig(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getAllApprovedGig API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getAllApprovedGig ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const getGigByUserId = async (req, res) => {
    try {
        const response = await GigService.getGigByUserId(req, res);
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
        let gig_data;
        if (req.body.ref == 'gig') {
            await GigSchema.find(
                {
                    _id: new ObjectId(req.body.gig_id)
                }
            ).then((result) => {
                if (result) {
                    gig_data = result
                } else {
                    logger.error('Gig not found');
                    return responseData.fail(res, 'Gig not found', 400);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
            })
        }
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
            gig_data[0].images = imageUrls
            await GigSchema.findOneAndUpdate(
                {
                    _id: new ObjectId(req?.body?.gig_id)
                },
                gig_data[0],
                { new: true }
            ).then((result) => {
                if (result) {
                    logger.info('Image File uploaded successfully');
                    return responseData.success(res, result, 'Image File uploaded successfully');
                } else {
                    logger.error('Gig not found');
                    return responseData.fail(res, 'Gig not found', 400);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
            })
        }
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
    }
};

const uploadVideoController = async (req, res) => {
    try {
        let gig_data;
        if (req.body.ref == 'gig') {
            await GigSchema.find(
                {
                    _id: new ObjectId(req.body.gig_id)
                }
            ).then((result) => {
                if (result) {
                    gig_data = result
                } else {
                    logger.error('Gig not found');
                    return responseData.fail(res, 'Gig not found', 400);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
            })
        }
        const videoSize = req?.file?.size;
        const MAX_VIDEO_SIZE_MB = 100;
        if (videoSize > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            logger.error(`Video exceeds the maximum size of ${MAX_VIDEO_SIZE_MB}MB`);
            return responseData.fail(res, `Video exceeds the maximum size of ${MAX_VIDEO_SIZE_MB}MB`, 400);
        } else {
            const videoUrl = await uploadVideo(req.file, 'Gig Folder');
            gig_data[0].video = videoUrl
            await GigSchema.findOneAndUpdate(
                {
                    _id: new ObjectId(req?.body?.gig_id)
                },
                gig_data[0],
                { new: true }
            ).then((result) => {
                if (result) {
                    logger.info('Video File uploaded successfully');
                    return responseData.success(res, result, 'Video File uploaded successfully');
                } else {
                    logger.error('Gig not found');
                    return responseData.fail(res, 'Gig not found', 400);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
            })

        }
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
    }
};

module.exports = {
    createGig,
    uploadMultipleImage,
    uploadVideoController,
    getGig,
    getAllApprovedGig,
    getGigByUserId,
    getGigByGigId,
    gigDelete,
    gigUpdate,
    gigStatusUpdate
};