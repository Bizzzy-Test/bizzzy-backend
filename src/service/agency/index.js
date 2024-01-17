const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const AgencySchema = require("../../models/agencyProfile")
const FreelancerSchema = require("../../models/profile")
const { logger } = require("../../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const createAgency = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencySchema.find(
            { user_id: userData._id }
        ).then(async (result) => {
            if (result?.length !== 0) {
                logger.error('You have already create agency for this freelancer');
                return responseData.fail(res, 'You have already create agency for this freelancer', 400);
            } else {
                req.body['user_id'] = userData._id;
                const agencyProfile = new AgencySchema(req.body);
                await agencyProfile.save().then(async (result) => {
                    logger.info('Agency profile created successfully');
                    await FreelancerSchema.findOneAndUpdate(
                        {
                            user_id: userData._id
                        },
                        {
                            agency_profile: result._id
                        },
                        { new: true }
                    )
                    return responseData.success(res, result, 'Agency profile created successfully');
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                });
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        });
    })
};

const updateAgency = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencySchema.findOneAndUpdate(
            {
                _id: new ObjectId(req.query.agency_id),
                user_id: userData._id
            },
            req.body,
            { new: true }
        ).then((result) => {
            if (result.length !== 0) {
                logger.info('Agency profile updated successfully');
                return responseData.success(res, result, 'Agency profile updated successfully');
            } else {
                logger.info('Agency profile not updated');
                return responseData.fail(res, 'Agency profile not updated', 400);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getAgencyById = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencySchema.find(
            {
                _id: new ObjectId(req.query.agency_id),
                user_id: userData._id
            }
        ).then((result) => {
            if (result.length !== 0) {
                logger.info('Agency profile fetched successfully');
                return responseData.success(res, result, 'Agency profile fetched successfully');
            } else {
                logger.info('Agency profile not found');
                return responseData.success(res, result, 'Agency profile not found');
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
};

const deleteAgency = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData?.role == 1) {
            await AgencySchema.deleteOne(
                {
                    _id: new ObjectId(req.query.agency_id),
                    user_id: userData._id
                }
            ).then(async (result) => {
                if (result?.deletedCount !== 0) {
                    logger.info('Agency Deleted successfully');
                    return responseData.success(res, result, 'Agency Deleted successfully');
                } else {
                    logger.error('Agency Not Found');
                    return responseData.fail(res, 'Agency Not Found', 200);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error('Only freelancer can delete the agency profile');
            return responseData.fail(res, 'Only freelancer can delete the agency profile', 401);
        }
    })
}

module.exports = {
    createAgency,
    updateAgency,
    deleteAgency,
    getAgencyById
};