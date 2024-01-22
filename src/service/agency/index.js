const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const AgencySchema = require("../../models/agency_profile");
const profile = require("../../models/profile");
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
                logger.error('You already have an agency profile.');
                return responseData.fail(res, 'You already have an agency profile.', 400);
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
        const query = [
            {
                $match: {
                    _id: new ObjectId(req.query.agency_id),
                    user_id: userData._id
                }
            },
            {
                $lookup: {
                    from: 'feedbacks',
                    localField: 'user_id',
                    foreignField: 'reciever_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'freelancer_profiles',
                                localField: 'sender_id',
                                foreignField: 'user_id',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            firstName: 1,
                                            lastName: 1,
                                            location: 1,
                                            professional_role: 1,
                                            profile_image: 1
                                        }
                                    }
                                ],
                                as: 'freelancer_details'
                            },
                        },
                        {
                            $lookup: {
                                from: 'client_profiles',
                                localField: 'sender_id',
                                foreignField: 'user_id',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            firstName: 1,
                                            lastName: 1,
                                            businessName: 1,
                                            profile_image: 1,
                                            location: 1
                                        }
                                    }
                                ],
                                as: 'client_details'
                            },
                        },
                        {
                            $lookup: {
                                from: 'jobs',
                                localField: 'job_id',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            title: 1,
                                            description: 1,
                                            job_type: 1,
                                            status: 1,
                                        }
                                    }
                                ],
                                as: 'job_details'
                            }
                        },
                        {
                            $addFields: {
                                sender_details: {
                                    $ifNull: [
                                        { $arrayElemAt: ['$freelancer_details', 0] },
                                        { $arrayElemAt: ['$client_details', 0] }
                                    ]
                                },
                                job_details: { $ifNull: [{ $arrayElemAt: ['$job_details', 0] }, null] },
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                feedback_details: '$public_feedback',
                                sender_details: 1,
                                job_details: 1,
                            }
                        },
                    ],
                    as: 'work_history',
                }
            }
        ]
        await AgencySchema.aggregate(query).then(async (result) => {
            if (result?.length !== 0) {
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

const getAgency = async (req, userData, res) => {
    return new Promise(async () => {
        const freelancerProfile = await profile.aggregate([
            {
                $match: {
                    user_id: userData._id
                }
            },
            {
                $project: {
                    agency_profile: 1
                }
            }
        ]);

        if (!freelancerProfile || freelancerProfile.length === 0) {
            return reject("User not found in freelancer_profile");
        }

        const agencyId = freelancerProfile[0].agency_profile;
        const agencyData = await AgencySchema.aggregate([
            {
                $match: {
                    _id: agencyId
                }
            }
        ]);

        if (!agencyData || agencyData.length === 0) {
            return reject("Agency not found");
        }

        return responseData.success(res, agencyData[0], 'Agency Details Fetch Successfully');
    })
}

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
    getAgencyById,
    getAgency
};