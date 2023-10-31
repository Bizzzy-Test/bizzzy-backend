
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const InviteSchema = require('../../models/invite');
const UserSchema = require('../../models/users');
const MessageSchema = require('../../models/message');
const { logger, mail } = require('../../utils');

// Send user invite
const sendInvitation = async (body, userData, res) => {
    return new Promise(async () => {
        if(userData.role=='client'){
            body['sender_id']=userData._id;
            const find_invite = await InviteSchema.findOne(
                {
                    $and: [
                        { receiver_id: body.receiver_id },
                        { sender_id: body.sender_id },
                        { job_id: body.job_id }
                    ]
                })
            if(find_invite){
                logger.info(messageConstants.INVITATION_ALREADY_EXIST);
                return responseData.fail(res, `${messageConstants.INVITATION_ALREADY_EXIST}`, 403);
            }else{
                const invitationResponse = await saveInvitation(body);
                const user = await UserSchema.findOne({ _id: body.receiver_id });
                const mailContent = {
                    name: user.firstname,
                    email : user.email,
                    message: body.message,
                    link: `${process.env.BASE_URL}/message/invitation?job_id=${body.job_id}&invite_id=${invitationResponse.invite_result._id}`,
                };
                await mail.sendMailtoUser(mailTemplateConstants.INVITATION_TEMPLATE, user.email, "Invitation", res, mailContent);
                logger.info(messageConstants.INVITATION_SEND_SUCCESSFULLY);
                return responseData.success(res, {}, messageConstants.INVITATION_SEND_SUCCESSFULLY);
            }
        }else{
                logger.info(messageConstants.NOT_SENT_INVITE);
                return responseData.fail(res, `${messageConstants.NOT_SENT_INVITE}. ${err}`, 401);
        }
    })
}
// For Save Invitation Details
const saveInvitation = async (body) => {
    try {
        const invitationSchema = new InviteSchema(body);
        const invite_result = await invitationSchema.save();
        body['message_type']=2;
        const messageSchema = new MessageSchema(body);
        const message_result = await messageSchema.save();
        logger.info(messageConstants.INVITATION_SEND_SUCCESSFULLY);
        return {invite_result:invite_result, message_result:message_result};
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
                    { _id: invite_id }
                ]
            }
        ).then(async (result) => {
            if (result.length !== 0) {
                await InviteSchema.findOneAndUpdate(
                    {  $and: [
                        { _id : invite_id },
                        { receiver_id: req.userId },
                        { job_id: job_id },
                    ] },
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

// Invitation details get for freelencer
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
                            job_id: job_id
                        },
                        {
                            is_deleted: false
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'user_profiles',
                    localField: 'sender_id',
                    foreignField: 'user_id',
                    pipeline: [
                        { $project: { _id: 1, user_id:1, name: 1, profile_image: 1, position: 1 } }
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

module.exports = {
    sendInvitation,
    updateInvitationStatus,
    getInvitationDetails
}