const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const AgencySchema = require("../../models/agency_profile");
const UserSchema = require("../../models/users");
const AgencyInviteSchema = require("../../models/agency_invite");
const profile = require("../../models/profile");
const FreelancerSchema = require("../../models/profile")
const { logger, mail } = require("../../utils");
const mongoose = require("mongoose");
const { mailTemplateConstants } = require("../../constants/mail");
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
                user_id: userData?._id
            },
            req.body,
            { new: true }
        ).then((result) => {
            if (result?.length !== 0) {
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

const createProject = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencySchema.findOne(
            {
                user_id: new ObjectId(userData?._id)
            }
        ).then(async (result) => {
            if (result) {
                result.agency_portfolio.push(req.body)
                await AgencySchema.findOneAndUpdate(
                    {
                        user_id: new ObjectId(userData?._id)
                    },
                    result,
                    { new: true }
                ).then((result) => {
                    if (result) {
                        logger.info('Agency portfolio uploaded successfully');
                        return responseData.success(res, result, 'Agency portfolio uploaded successfully');
                    } else {
                        logger.info('Agency profile not found');
                        return responseData.fail(res, 'Agency profile not found', 400);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
                })
            } else {
                logger.info('Agency profile not found');
                return responseData.fail(res, 'Agency profile not found', 400);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        });
    })
};



const getAgencyById = async (req, userData, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: {
                    _id: new ObjectId(req?.query?.agency_id),
                    user_id: userData?._id
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

const getAllAgency = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencySchema.find().then(async (result) => {
            if (result?.length !== 0) {
                logger.info('Agency list fetched successfully');
                return responseData.success(res, result, 'Agency list fetched successfully');
            } else {
                logger.info('Agency list not found');
                return responseData.success(res, result, 'Agency list not found');
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
};

const searchAgency = async (req, userData, res) => {
    return new Promise(async () => {
        let { skills, experience, hourlyRateMin, hourlyRateMax, searchText, categoryId } = req?.query;
        if (skills?.length == 0 && experience?.length == 0 && !hourlyRateMin && !hourlyRateMax) {
            result = await ProfileSchema.find({});
        } else {
            let query = {};
            if (skills) {
                query.agency_skills = { $regex: new RegExp(skills, 'i') };
            }
            if (categoryId) {
                query['agency_services.category'] = categoryId;
            }
            if (hourlyRateMin && hourlyRateMax) {
                query.agency_hourlyRate = { $gte: Number(hourlyRateMin), $lte: Number(hourlyRateMax) };
            }
            if (searchText) {
                query.$or = [
                    { agency_tagline: { $regex: new RegExp(searchText, 'i') } },
                    { agency_overview: { $regex: new RegExp(searchText, 'i') } },
                    { agency_skills: { $regex: new RegExp(searchText, 'i') } },
                    { agency_name: { $regex: new RegExp(searchText, 'i') } },
                ];
            }
            await AgencySchema.find(query).then(async (result) => {
                logger.info('Agency search successfully');
                return responseData.success(res, result, 'Agency search successfully');
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        }
    })
}

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
            return responseData.fail(res, "Agency not found", 404);
        }
        return responseData.success(res, agencyData[0], 'Agency Details Fetch Successfully');
    })
}

const deleteAgency = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData?.role == 1) {
            await AgencySchema.deleteOne(
                {
                    _id: new ObjectId(req?.query?.agency_id),
                    user_id: userData?._id
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

const sendInvitationToFreelancer = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencyInviteSchema.find(
            {
                agency_id: new ObjectId(req?.body?.agency_profile),
                freelancer_id: new ObjectId(req?.body?.freelancer_id)
            }
        ).then(async (result) => {
            if (result?.length !== 0) {
                logger.error('Invitation already sended to this freelancer');
                return responseData.fail(res, 'Invitation already sended to this freelancer', 400);
            } else {
                req.body['agency_id'] = req?.body?.agency_profile;
                const agencyInviteSchema = new AgencyInviteSchema(req.body);
                const agency_data = await AgencySchema.findOne({ _id: new ObjectId(req?.body?.agency_profile) })
                const receiver_data = await UserSchema.findOne({ _id: new ObjectId(req?.body?.freelancer_id) })
                await agencyInviteSchema.save().then(async (result) => {
                    const link = `${process.env.BASE_URL}/agency/invitation?agency_id=${req?.body?.agency_profile}&user_id=${userData?._id}`;
                    const mailContent = {
                        name: receiver_data.firstName ?? "",
                        client_name: userData.firstName,
                        job_title: agency_data.agency_tagline,
                        business_name: agency_data.agency_name,
                        email: receiver_data.email ?? "",
                        message: result.message,
                        link: link,
                    };
                    mail.sendMailtoUser(mailTemplateConstants.INVITATION_TEMPLATE, receiver_data.email, "Invitation", res, mailContent);
                    logger.info('Invitation send successfully');
                    return responseData.success(res, result, 'Invitation send successfully');
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                })
            }
        })
    })
};

const updateInvitationByFreelancer = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencyInviteSchema.updateOne(
            {
                _id: new ObjectId(req.body.invite_id),
                freelancer_id: new ObjectId(userData._id)
            },
            { $set: { status: req.body.status } },
            { new: true }
        ).then(async (result) => {
            if (result?.modifiedCount !== 0) {
                logger.info(messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
                return responseData.success(res, result, messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
            } else if (result?.matchedCount !== 0) {
                logger.info("Invitation already updated");
                return responseData.success(res, result, "Invitation already updated");
            } else {
                logger.error(messageConstants.INVITATION_NOT_FOUND);
                return responseData.success(res, result, messageConstants.INVITATION_NOT_FOUND);
            }
        })
    }).catch((err) => {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
    })
};

const updateInvitationByAgency = async (req, userData, res) => {
    return new Promise(async () => {
        await AgencyInviteSchema.updateOne(
            {
                _id: new ObjectId(req.body.invite_id),
                agency_id: new ObjectId(req.body.agency_profile)
            },
            { $set: { status: req.body.status } },
            { new: true }
        ).then(async (result) => {
            if (result?.modifiedCount !== 0) {
                logger.info(messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
                return responseData.success(res, result, messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
            } else if (result?.matchedCount !== 0) {
                logger.info("Invitation already updated");
                return responseData.success(res, result, "Invitation already updated");
            } else {
                logger.error(messageConstants.INVITATION_NOT_FOUND);
                return responseData.success(res, result, messageConstants.INVITATION_NOT_FOUND);
            }
        })
    }).catch((err) => {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
    })
};

const getStatusData = async (req, userData, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: {
                    agency_id: new ObjectId(req.query.agency_id)
                }
            },
            {
                $lookup: {
                    from: 'freelancer_profiles',
                    localField: 'freelancer_id',
                    foreignField: 'user_id',
                    as: 'freelancer_details'
                }
            }
        ]
        await AgencyInviteSchema.aggregate(query).then(async (results) => {
            if (results.length !== 0) {
                const acceptedInvitations = [];
                const rejectedInvitations = [];
                const pendingInvitations = [];
                const cancelInvitations = [];

                results.forEach(invitation => {
                    if (invitation.status === "accepted") {
                        acceptedInvitations.push(invitation);
                    } else if (invitation.status === "rejected") {
                        rejectedInvitations.push(invitation);
                    } else if (invitation.status === "cancel") {
                        cancelInvitations.push(invitation);
                    } else if (invitation.status === "pending") {
                        pendingInvitations.push(invitation);
                    }
                });

                const data = {
                    acceptedInvitations,
                    rejectedInvitations,
                    pendingInvitations,
                    cancelInvitations
                }
                logger.info(`Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, data, `Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`Invitation ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.success(res, [], `Invitation ${messageConstants.LIST_NOT_FOUND}`);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}
// 
module.exports = {
    createAgency,
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
    createProject
};