const { messageConstants, responseData } = require("../../constants");
const { logger } = require("../../utils");
const MessageSchema = require('../../models/message');

const getMessageList = (req, user, res) => {
    return new Promise(async () => {
        logger.info(`Message ${messageConstants.LIST_API_CALL_SUCCESSFULLY}`);
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
                            sender_id: user._id.toString(),
                            receiver_id: req.query.receiver_id,
                        },
                        {
                            sender_id: req.query.receiver_id,
                            receiver_id: user._id.toString(),
                        }
                    ]
                }
            },
            {
                $addFields: {
                    sender_id_ObjectId: { $toObjectId: '$sender_id' },
                    receiver_id_ObjectId: { $toObjectId: '$receiver_id' },
                    job_id_ObjectId: { $toObjectId: '$job_id' }
                }
            },
            {
                $lookup: {
                    from: 'freelencer_profiles',
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
                    from: 'freelencer_profiles',
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
                            client_detail: 1,
                            amount: 1,
                            budget: 1
                        }
                    }],
                    as: 'job_details'
                }
            },
            {
                $addFields: {
                    sender_details: {
                        $ifNull: [
                            { $arrayElemAt: ['$sender_freelancer', 0] },
                            { $arrayElemAt: ['$sender_client', 0] }
                        ]
                    },
                    receiver_details: {
                        $ifNull: [
                            { $arrayElemAt: ['$receiver_client', 0] },
                            { $arrayElemAt: ['$receiver_freelancer', 0] }
                        ]
                    }
                }
            },
            {
                $project: {
                    sender_id_ObjectId: 0,
                    receiver_id_ObjectId: 0,
                    job_id_ObjectId: 0,
                    sender_freelancer: 0,
                    sender_client: 0,
                    receiver_client: 0,
                    receiver_freelancer: 0
                }
            }
        ]
        await MessageSchema.aggregate(query).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`Message ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `Message ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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
                        { sender_id: user._id.toString() },
                        { receiver_id: user._id.toString() }
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
                    pipeline: [{ $project: { title: 1, client_detail: 1, budget: 1, amount: 1 } }],
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
                    from: 'freelencer_profiles',
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
                    user_details: {
                        $cond: {
                            if: { $gt: [{ $size: '$clientProfile' }, 0] },
                            then: { $arrayElemAt: ['$clientProfile', 0] },
                            else: { $arrayElemAt: ['$freelancerProfile', 0] }
                        }
                    },
                    job_details: 1
                }
            }
        ]
        await MessageSchema.aggregate(query).then(async (result) => {
            if (result.length !== 0) {
                logger.info(`Chat User ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `Chat User ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
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




module.exports = {
    getMessageList,
    getChatUserList
}