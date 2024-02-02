const { messageConstants, responseData } = require("../../constants");
const { logger } = require("../../utils");
const MessageSchema = require('../../models/message');
const { getClientDetails } = require("../profile");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getMessageList = (req, user, res) => {
    return new Promise(async () => {
        logger.info(`Message ${messageConstants.LIST_API_CALL_SUCCESSFULLY}`);
        const receiverId = new mongoose.Types.ObjectId(req.query.receiver_id);
        const userId = new mongoose.Types.ObjectId(user._id);

        const pipeline = [
            {
                $project: {
                    user_id: 1,
                    firstName: 1,
                    lastName: 1,
                    lastMessage: 1,
                    profile_image: 1,
                    businessName: 1
                }
            }
        ]
        const query = [
            {
                $match: {
                    $or: [
                        {
                            sender_id: userId,
                            receiver_id: receiverId,
                        },
                        {
                            sender_id: receiverId,
                            receiver_id: userId,
                        }
                    ]
                }
            },
            {
                $addFields: {
                    sender_id_ObjectId: { $toObjectId: '$sender_id' },
                    // receiver_id_ObjectId: { $toObjectId: '$receiver_id' },
                    job_id_ObjectId: { $toObjectId: '$job_id' }
                }
            },
            {
                $lookup: {
                    from: 'freelancer_profiles',
                    localField: 'sender_id_ObjectId',
                    foreignField: 'user_id',
                    pipeline: pipeline,
                    as: 'sender_freelancer'
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'sender_id_ObjectId',
                    foreignField: 'user_id',
                    pipeline: pipeline,
                    as: 'sender_client'
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'receiver_id_ObjectId',
                    foreignField: 'user_id',
                    pipeline: pipeline,
                    as: 'receiver_client'
                }
            },
            {
                $lookup: {
                    from: 'freelancer_profiles',
                    localField: 'receiver_id_ObjectId',
                    foreignField: 'user_id',
                    pipeline: pipeline,
                    as: 'receiver_freelancer'
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job_id_ObjectId',
                    foreignField: '_id',
                    pipeline: [{
                        $project: {
                            title: 1,
                            client_id: 1,
                            amount: 1,
                            job_type: 1
                        }
                    }],
                    as: 'job_details'
                }
            },
            {
                $project: {
                    sender_id_ObjectId: 0,
                    receiver_id_ObjectId: 0,
                    job_id_ObjectId: 0,
                    receiver_client: 0,
                    receiver_freelancer: 0
                }
            }
        ]
        await MessageSchema.aggregate(query).then(async (results) => {
            if (results.length !== 0) {
                for (let result of results) {
                    if (result?.sender_freelancer?.length) {
                        result['sender_details'] = result?.sender_freelancer[0]
                    } else {
                        result['sender_details'] = await getClientDetails(result?.sender_client[0], result?.sender_client[0]?.user_id);
                    }
                    delete result?.sender_freelancer;
                    delete result?.sender_client;
                }
                logger.info(`Message ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, results, `Message ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`Message ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.success(res, [], `Message ${messageConstants.LIST_NOT_FOUND}`);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getChatUserList = (req, user, res) => {
    return new Promise(async () => {
        logger.info(`Chat user ${messageConstants.LIST_API_CALL_SUCCESSFULLY}`);
        const query = [
            {
                $match: {
                    $or: [
                        { sender_id: user._id },
                        { receiver_id: user._id }
                    ],
                },
            },
            {
                $project: {
                    chatId: '$_id',
                    otherParty: {
                        $cond: [
                            { $eq: ['$sender_id', user._id.toString()] },
                            { $toObjectId: '$receiver_id' },
                            { $toObjectId: '$sender_id' }
                        ],
                    },
                    lastMessage: '$message',
                    timestamp: '$created_at',
                    job_id_ObjectId: { $toObjectId: '$job_id' }
                },
            },
            {
                $group: {
                    _id: '$otherParty',
                    chatId: { $first: '$chatId' },
                    lastMessage: { $last: '$lastMessage' },
                    timestamp: { $last: '$timestamp' },
                    job_ids: { $addToSet: '$job_id_ObjectId' }
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job_ids',
                    foreignField: '_id',
                    pipeline: [{ $project: { title: 1, client_id: 1, job_type: 1, amount: 1 } }],
                    as: 'job_details'
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$user_id', '$$userId']
                                }
                            }
                        },
                        {
                            $project: {
                                user_id: 1,
                                firstName: 1,
                                lastName: 1,
                                profile_image: 1,
                                businessName: 1
                            }
                        }
                    ],
                    as: 'clientProfile'
                }
            },
            {
                $lookup: {
                    from: 'freelancer_profiles',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$user_id', '$$userId']
                                }
                            }
                        },
                        {
                            $project: {
                                user_id: 1,
                                firstName: 1,
                                lastName: 1,
                                profile_image: 1,
                            }
                        }
                    ],
                    as: 'freelancerProfile'
                }
            },
            {
                $project: {
                    chatId: 1,
                    otherParty: 1,
                    lastMessage: 1,
                    timestamp: 1,
                    clientProfile: 1,
                    freelancerProfile: 1,
                    job_details: 1
                }
            }
        ]
        await MessageSchema.aggregate(query).then(async (results) => {
            if (results.length !== 0) {
                for (let result of results) {
                    if (result?.clientProfile?.length) {
                        result['user_details'] = await getClientDetails(result?.clientProfile[0], result?.clientProfile[0]?.user_id);
                    } else {
                        result['user_details'] = result?.freelancerProfile[0];
                    }
                    delete result?.clientProfile;
                    delete result?.freelancerProfile;
                }
                logger.info(`Chat User ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, results, `Chat User ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`Chat user ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.success(res, [], `Chat User ${messageConstants.LIST_NOT_FOUND}`);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const deleteMessage = (req, userData, res) => {
    return new Promise(async () => {
        const message_id = new ObjectId(req?.query?.message_id);
        const sender_id = new ObjectId(userData?._id);
        await MessageSchema.findOne({ _id: message_id }).then(async (result) => {
            if (result) {
                await MessageSchema.updateOne({ _id: message_id, sender_id }, { is_deleted: true }, { new: true }).then((result) => {
                    if (result?.modifiedCount !== 0) {
                        logger.info(`Message Deleted Successfully`);
                        return responseData.success(res, result, 'Message Deleted Successfully');
                    } else if (result?.matchedCount !== 0) {
                        logger.info(`Message already deleted`);
                        return responseData.success(res, result, 'Message already deleted');
                    } else {
                        logger.info(`You're not allowed to delete this message`);
                        return responseData.fail(res, `You're not allowed to delete this message`, 401);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                })
            } else {
                logger.error('Message Not Found');
                return responseData.success(res, result, 'Message Not Found');
            }

        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })

    })
}




module.exports = {
    getMessageList,
    getChatUserList,
    deleteMessage
}