
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const InviteSchema = require('../../models/invite');
const UserSchema = require('../../models/users');
const ClientSchema = require('../../models/clientProfile');
const JobSchema = require('../../models/job');
const MessageSchema = require('../../models/message');
const { logger, mail } = require('../../utils');
const mongoose = require("mongoose");
const { getClientDetails } = require('../profile');
const ObjectId = mongoose.Types.ObjectId;
// Send user invite
const sendInvitation = async (body, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            body['sender_id'] = userData._id;
            await InviteSchema.find({
                $and: [
                    { receiver_id: new ObjectId(body.receiver_id) },
                    { sender_id: body.sender_id },
                    { job_id: new ObjectId(body.job_id) }
                ]
            }).then(async (result) => {
                if (result?.length !== 0) {
                    logger.info(messageConstants.INVITATION_ALREADY_EXIST);
                    return responseData.fail(res, `${messageConstants.INVITATION_ALREADY_EXIST}`, 403);
                } else {
                    const user = await UserSchema.findOne({ _id: body.receiver_id });
                    const client_details = await ClientSchema.findOne({ user_id: userData._id });
                    const job_details = await JobSchema.findOne({ _id: new ObjectId(body.job_id) })
                    const invitationSchema = new InviteSchema(body);
                    await invitationSchema.save().then(async (result1) => {
                        if (result1?.length !== 0) {
                            body['message_type'] = 2;
                            const messageSchema = new MessageSchema(body);
                            await messageSchema.save().then(async (result) => {
                                const mailContent = {
                                    name: user.firstName ?? "",
                                    client_name: client_details.firstName + client_details.lastName,
                                    job_title: job_details.title,
                                    business_name: client_details.businessName,
                                    email: user.email ?? "",
                                    message: result.message,
                                    link: `${process.env.BASE_URL}/message/invitation?job_id=${result.job_id}&invite_id=${result1._id}`,
                                };
                                await mail.sendMailtoUser(mailTemplateConstants.INVITATION_TEMPLATE, user.email, "Invitation", res, mailContent);
                                logger.info(messageConstants.INVITATION_SEND_SUCCESSFULLY);
                                return responseData.success(res, {}, messageConstants.INVITATION_SEND_SUCCESSFULLY);
                            });
                        }
                    })
                }
            })
        } else {
            logger.info(messageConstants.NOT_SENT_INVITE);
            return responseData.fail(res, `${messageConstants.NOT_SENT_INVITE}`, 401);
        }
    })
}
// Update invitation status
const updateInvitationStatus = async (req, res) => {
    return new Promise(async () => {
        await InviteSchema.updateOne(
            { _id: new ObjectId(req.body.invite_id) },
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
}

// Invitation details
const getInvitationDetails = async (req, userData, res,) => {
    return new Promise(async () => {
        const { job_id } = req.query;
        const query = [
            {
                $match: {
                    $and: [
                        {
                            receiver_id: userData._id
                        },
                        {
                            job_id: new ObjectId(job_id)
                        },
                        {
                            is_deleted: false
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'sender_id',
                    foreignField: 'user_id',
                    pipeline: [
                        { $project: { _id: 1, user_id: 1, firstName: 1, profile_image: 1 } }
                    ],
                    as: 'client_details'
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job_id',
                    foreignField: '_id',
                    as: 'job_details'
                }
            }
        ]
        await InviteSchema.aggregate(query).then(async (results) => {
            if (results.length !== 0) {
                for (let result of results) {
                    result.client_details[0] = await getClientDetails(result?.client_details[0], result?.client_details[0]?.user_id);
                }
                logger.info(`Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, results, `Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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

// Get invited freelancers list
const getInvitedFreelancers = async (userData, res) => {
    return new Promise(async () => {
        if (userData?.role == 2) {
            const query = [
                {
                    $match: {
                        sender_id: userData._id
                    }
                },
                {
                    $lookup: {
                        from: 'freelancer_profiles',
                        localField: 'receiver_id',
                        foreignField: 'user_id',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    user_id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    location: 1,
                                    professional_role: 1,
                                    profile_image: 1,
                                    hourly_rate: 1,
                                    skills: 1
                                }
                            }
                        ],
                        as: 'freelancer_details'
                    }
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'job_id',
                        foreignField: '_id',
                        pipeline: [{
                            $project: {
                                _id: 1,
                                title: 1,
                                description: 1,
                                client_id: 1,
                                job_type: 1,
                                amount: 1,
                                file: 1,
                                experience: 1,
                            }
                        }],
                        as: 'job_details'
                    }
                }
            ]
            await InviteSchema.aggregate(query).then(async (result) => {
                if (result?.length !== 0) {
                    logger.info(`Get User Invitation details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                    return responseData.success(res, result, `Get User Invitation details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                } else {
                    logger.info(`List ${messageConstants.NOT_FOUND}`);
                    return responseData.fail(res, `User invitation list ${messageConstants.NOT_FOUND}`, 200);
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.info(messageConstants.NOT_ALLOWED);
            return responseData.fail(res, `${messageConstants.NOT_ALLOWED}`, 401);
        }
    })
}

// Invitation details get for freelancer
const getInvitationDetailForFreelancer = async (req, res,) => {
    return new Promise(async () => {
        const { invitation_id } = req.query;
        const query = [
            {
                $match: {
                    _id: new ObjectId(invitation_id)
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'sender_id',
                    foreignField: 'user_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                location: 1,
                                user_id: 1,
                                firstName: 1,
                                lastName: 1,
                                reviews: { $ifNull: ['$reviews', []] } // If reviews is null, return an empty array
                            }
                        }
                    ],
                    as: 'client_details'
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job_id',
                    foreignField: '_id',
                    pipeline: [
                        { $project: { file: 0, client_id: 0, } }
                    ],
                    as: 'job_details'
                }
            }
        ]
        await InviteSchema.aggregate(query).then(async (results) => {
            if (results.length !== 0) {
                for (let result of results) {
                    result.client_details[0] = await getClientDetails(result?.client_details[0], result?.client_details[0]?.user_id)
                }
                logger.info(`Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, results, `Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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


module.exports = {
    sendInvitation,
    updateInvitationStatus,
    getInvitationDetails,
    getInvitedFreelancers,
    getInvitationDetailForFreelancer
}