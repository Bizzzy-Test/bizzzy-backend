const { messageConstants } = require("../../constants");
const { gigStatus } = require("../../constants/enum");
const responseData = require("../../constants/responses");
const GigSchema = require("../../models/gig")
const { logger } = require("../../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createGig = async (req, userData, res) => {
    return new Promise(async () => {
        req.body['freelancer_id'] = userData._id
        if (userData.role == 1) {
            const gigSchema = new GigSchema(req.body);
            await gigSchema.save().then(async (result) => {
                logger.info('Gig created successfully');
                return responseData.success(res, result, 'Gig created successfully');
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error('Only freelancer can create new gig');
            return responseData.fail(res, 'Only freelancer can create new gig', 401);
        }
    })
};

const getGig = async (req, userData, res) => {
    return new Promise(async () => {
        await GigSchema.find({
            freelancer_id: new ObjectId(userData._id)
        }).then((result) => {
            if (result?.length == 0) {
                logger.info('Gigs list not found');
                return responseData.success(res, result, 'Gigs list not found');
            } else {
                logger.info('Gigs list retrived successfully');
                return responseData.success(res, result, 'Gigs list retrived successfully');
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
};

const getAllApprovedGig = async (req, res) => {
    return new Promise(async () => {
        await GigSchema.find({ status: gigStatus.ACCEPT }).then((result) => {
            if (result?.length == 0) {
                logger.info('Gigs list not found');
                return responseData.success(res, result, 'Gigs list not found');
            } else {
                logger.info('Gigs list retrived successfully');
                return responseData.success(res, result, 'Gigs list retrived successfully');
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
};

const getGigByUserId = async (req, res) => {
    return new Promise(async () => {
        if (req?.query?.user_id) {
            await GigSchema.find(
                {
                    freelancer_id: new ObjectId(req?.query?.user_id),
                    status: gigStatus.ACCEPT
                }).then((result) => {
                    if (result?.length == 0) {
                        logger.info('Gigs list not found');
                        return responseData.success(res, result, 'Gigs list not found');
                    } else {
                        logger.info('Gigs list retrived successfully');
                        return responseData.success(res, result, 'Gigs list retrived successfully');
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                })
        } else {
            logger.error('Please pass user_id in the query params');
            return responseData.fail(res, 'Please pass user_id in the query params', 400);
        }
    })
};

const getGigByGigId = async (req, res) => {
    return new Promise(async () => {
        await GigSchema.find({ _id: new ObjectId(req.query.gig_id) }).then((result) => {
            if (result?.length == 0) {
                logger.info('Gigs not found');
                return responseData.success(res, result, 'Gigs not found');
            } else {
                logger.info('Gigs retrived successfully');
                return responseData.success(res, result, 'Gigs retrived successfully');
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
};

const gigDelete = async (req, userData, res) => {
    return new Promise(async () => {
        await GigSchema.deleteOne(
            {
                _id: new ObjectId(req.query.gig_id),
                freelancer_id: new ObjectId(userData?._id)
            }).then((result) => {
                if (result?.deletedCount !== 0) {
                    logger.info('Gig Deleted successfully');
                    return responseData.success(res, result, 'Gig Deleted successfully');
                } else {
                    logger.error('Gig Not Found');
                    return responseData.fail(res, 'Gig Not Found', 200);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
    })
};

const gigUpdate = async (req, userData, res) => {
    return new Promise(async () => {
        await GigSchema.findOne(
            {
                _id: new ObjectId(req.query.gig_id),
                freelancer_id: new ObjectId(userData?._id)
            }
        ).then(async (result) => {
            if (result) {
                await GigSchema.findOneAndUpdate(
                    {
                        _id: new ObjectId(req.query.gig_id),
                        freelancer_id: new ObjectId(userData?._id)
                    },
                    req.body,
                    { new: true, upsert: true }
                ).then((result) => {
                    if (result) {
                        logger.info('Gig updated successfully');
                        return responseData.success(res, result, 'Gig updated successfully');
                    } else {
                        logger.error('Gig not updated');
                        return responseData.fail(res, 'Gig not updated', 401);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
                })
            } else {
                logger.error('Gig not found');
                return responseData.fail(res, 'Gig not found', 200);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
        })
    })
};

const gigStatusUpdate = async (req, userData, res) => {
    return new Promise(async () => {
        await GigSchema.findOne(
            {
                _id: new ObjectId(req.query.gig_id),
                freelancer_id: new ObjectId(userData?._id)
            }
        ).then(async (result) => {
            if (result) {
                await GigSchema.findOneAndUpdate(
                    {
                        _id: new ObjectId(req.query.gig_id),
                        freelancer_id: userData._id
                    },
                    { status: req?.body?.status },
                    { new: true, upsert: true }
                ).then((result) => {
                    if (result) {
                        logger.info('Gig status updated successfully');
                        return responseData.success(res, result, 'Gig status updated successfully');
                    } else {
                        logger.error('Gig not updated');
                        return responseData.fail(res, 'Gig status not updated', 401);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
                })
            } else {
                logger.error('Gig not found');
                return responseData.fail(res, 'Gig not found', 200);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
        })
    })
};

module.exports = {
    createGig,
    getGig,
    getAllApprovedGig,
    getGigByUserId,
    getGigByGigId,
    gigDelete,
    gigUpdate,
    gigStatusUpdate
};