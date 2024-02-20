const GigSchema = require("../../models/gig")
const AgencySchema = require("../../models/agency_profile.js")
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { getMultipleFileUrls, uploadVideo } = require("../../middleware/index.js");
const responseData = require("../../constants/responses.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const uploadMultipleImage = async (req, res) => {
    try {
        let gig_data, agency_data;
        if (req.body.ref == 'create_gig') {
            await GigSchema.find(
                {
                    _id: new ObjectId(req.body.ref_id)
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
        } else if (req.body.ref == 'agency_project_portfolio') {
            await AgencySchema.find(
                {
                    _id: new ObjectId(req.body.ref_id)
                }
            ).then((result) => {
                if (result.length) {
                    agency_data = result[0]
                } else {
                    logger.error('Agency not found');
                    return responseData.fail(res, 'Agency not found', 400);
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
            if (req.body.ref == 'create_gig') {
                const imageUrls = await getMultipleFileUrls(req.files, 'Gig Folder');
                gig_data[0].images = imageUrls
                await GigSchema.findOneAndUpdate(
                    {
                        _id: new ObjectId(req?.body?.ref_id)
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
            } else if (req.body.ref == 'agency_project_portfolio') {
                const imageUrls = await getMultipleFileUrls(req.files, 'Agency Portfolio Folder');
                const index = agency_data.agency_portfolio.findIndex((item) => {
                    return item?._id.toString() == req?.query?.portfolio_id
                });
                agency_data.agency_portfolio[index].project_images = imageUrls;
                await AgencySchema.findOneAndUpdate(
                    {
                        _id: new ObjectId(req?.body?.ref_id)
                    },
                    agency_data,
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
                    _id: new ObjectId(req.body.ref_id)
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
                    _id: new ObjectId(req?.body?.ref_id)
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
    uploadMultipleImage,
    uploadVideoController
};