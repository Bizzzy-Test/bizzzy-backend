
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const InviteSchema = require('../../models/invite');
const UserSchema = require('../../models/users');
const ClientSchema = require('../../models/clientProfile');
const JobSchema = require('../../models/job');
const MessageSchema = require('../../models/message');
const { logger, mail } = require('../../utils');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// Send user invite
const sendInvitation = async (body, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            console.log("running role 2")
            body['sender_id'] = userData._id;
            const find_invite = await InviteSchema.findOne(
                {
                    $and: [
                        { receiver_id: body.receiver_id },
                        { sender_id: body.sender_id },
                        { job_id: new ObjectId(body.job_id) }
                    ]
                })
            if (find_invite) {
                logger.info(messageConstants.INVITATION_ALREADY_EXIST);
                return responseData.fail(res, `${messageConstants.INVITATION_ALREADY_EXIST}`, 403);
            } else {
                const invitationResponse = await saveInvitation(body);
                const user = await UserSchema.findOne({ _id: body.receiver_id });
                const client_details = await ClientSchema.findOne({ userId: new ObjectId(userData._id) });
                if (client_details) {
                    const job_details = await JobSchema.findOne({ client_detail: userData._id.toString() });
                    if (job_details) {
                        const mailContent = {
                            name: user.firstName??"",
                            client_name: client_details.firstName + client_details.lastName,
                            job_title: job_details.title,
                            business_name: client_details.businessName,
                            email: user.email??"",
                            message: body.message,
                            link: `${process.env.BASE_URL}/message/invitation?job_id=${body.job_id}&invite_id=${invitationResponse.invite_result._id}`,
                        };
                        await mail.sendMailtoUser(mailTemplateConstants.INVITATION_TEMPLATE, user.email, "Invitation", res, mailContent);
                        logger.info(messageConstants.INVITATION_SEND_SUCCESSFULLY);
                        return responseData.success(res, {}, messageConstants.INVITATION_SEND_SUCCESSFULLY);
                    } else {
                        logger.info(`Job ${messageConstants.NOT_FOUND}`);
                        return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                    }
                } else {
                    logger.info(`Client ${messageConstants.NOT_FOUND}`);
                    return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                }
            }
        } else {
            logger.info(messageConstants.NOT_SENT_INVITE);
            return responseData.fail(res, `${messageConstants.NOT_SENT_INVITE}`, 401);
        }
    })
}
// For Save Invitation Details
const saveInvitation = async (body) => {
    try {
        const invitationSchema = new InviteSchema(body);
        const invite_result = await invitationSchema.save();
        body['message_type'] = 2;
        const messageSchema = new MessageSchema(body);
        const message_result = await messageSchema.save();
        logger.info(messageConstants.INVITATION_SEND_SUCCESSFULLY);
        return { invite_result: invite_result, message_result: message_result };
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        throw err;
    }
}
// Update invitation status
const updateInvitationStatus = async (req, res) => {
    return new Promise(async () => {
        const { invite_id, status, job_id } = req.body;
        await InviteSchema.find(
            {
                $and: [
                    { receiver_id: req.userId },
                    { job_id: job_id },
                    { _id: new ObjectId(invite_id) }
                ]
            }
        ).then(async (result) => {
            if (result.length !== 0) {
                await InviteSchema.findOneAndUpdate(
                    {
                        $and: [
                            { _id: new ObjectId(invite_id) },
                            { receiver_id: req.userId },
                            { job_id: job_id },
                        ]
                    },
                    { $set: { status: status } },
                    { new: true }
                ).then((result) => {
                    if (result.length !== 0) {
                        logger.info(messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
                        return responseData.success(res, result, messageConstants.INVITATION_UPDATED_SUCCESSFULLY);
                    } else {
                        logger.error(messageConstants.INVITATION_NOT_FOUND);
                        return responseData.success(res, [], messageConstants.INVITATION_NOT_FOUND);
                    }
                })
            } else {
                logger.error("You are not allow to perform action");
                return responseData.fail(res, "You are not allow to perform action", 400);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

// Invitation details
const getInvitationDetails = async (req, res,) => {
    return new Promise(async () => {
        const { job_id } = req.query;
        const query = [
            {
                $match: {
                    $and: [
                        {
                            receiver_id: req.userId
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
                    foreignField: 'userId',
                    pipeline: [
                        { $project: { _id: 1, userId: 1, firstName: 1, profile_image: 1 } }
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
        await InviteSchema.aggregate(query).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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
        if (userData.role == 2) {
            const query = [
                {
                    $match: {
                        // sender_id: userData._id.toString()
                        sender_id: userData._id
                    }
                },
                {
                    $lookup: {
                        from: 'freelencer_profiles',
                        let: { receiverId: "$receiver_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [{ $toString: "$user_id" }, "$$receiverId"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    user_id: 1,
                                    name: { $concat: ["$firstName", " ", "$lastName"] },
                                    professional_role: 1,
                                    profile_image: 1,
                                    hourly_rate: 1,
                                    description: 1,
                                    skills: 1
                                }
                            }
                        ],
                        as: 'freelancerDetails'
                    }
                }
            ]
            await InviteSchema.aggregate(query).then(async (result) => {
                if (result.length !== 0) {
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

// Invitation details get for freelencer
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
                    foreignField: 'userId',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                location: 1,
                                userId: 1,
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
                        { $project: { file: 0, client_detail: 0, } }
                    ],
                    as: 'job_details'
                }
            }
        ]
        await InviteSchema.aggregate(query).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `Invitation ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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