const { messageConstants, responseData } = require("../../constants");
const { logger } = require("../../utils");
const MessageSchema = require('../../models/message');

const getMessageList = (req, user, res) => {
    return new Promise(async () => {
        logger.info(`Message ${messageConstants.LIST_API_CALL_SUCCESSFULLY}`);
        const role = req.query.role;
        const query = [
            {
                $match: {
                    $or: [
                        {
                            sender_id: user._id.toString(),
                            receiver_id: req.query.user_id,
                        },
                        {
                            sender_id: req.query.user_id,
                            receiver_id: user._id.toString(),
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: role == 2 ? 'client_profiles' : 'freelencer_profiles',
                    let: { senderId: "$sender_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [role == 2 ? '$userId' : '$user_id', { $toObjectId: "$$senderId" }] // Use the $$ syntax to refer to variables
                                }
                            }
                        },
                        { $project: { _id: 1, firstName: 1, lastName: 1, profile_image: 1, location: 1 } }
                    ],
                    as: 'sender_details'
                }
            },
            {
                $lookup: {
                    from: role == 2 ? 'client_profiles' : 'freelencer_profiles',
                    let: { receiverId: "$receiver_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [role == 2 ? '$userId' : '$user_id', { $toObjectId: "$$receiverId" }]
                                }
                            }
                        },
                        { $project: { _id: 1, firstName: 1, lastName: 1, profile_image: 1, location: 1 } }
                    ],
                    as: 'receiver_details'
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
                },
            },
            {
                $group: {
                    _id: '$otherParty',
                    chatId: { $first: '$chatId' },
                    lastMessage: { $last: '$lastMessage' },
                    timestamp: { $last: '$timestamp' },
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$userId', '$$userId']
                                }
                            }
                        },
                        {
                            $project: {
                                userId: 1,
                                firstName: 1,
                                lastName: 1,
                                profile_image: 1
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
                                profile_image: 1
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
                    }
                }
            }
            // // Look up the invitation collection to check the invitation status
            // {
            //     $lookup: {
            //         from: 'invitations',
            //         let: { chat_sender_id: '$sender_id', chat_receiver_id: '$receiver_id' },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $or: [
            //                             {
            //                                 $and: [
            //                                     { $eq: ['$sender_id', '$$chat_sender_id'] },
            //                                     { $eq: ['$receiver_id', '$$chat_receiver_id'] },
            //                                     { $eq: ['$status', 1] }
            //                                 ]
            //                             },
            //                             {
            //                                 $and: [
            //                                     { $eq: ['$sender_id', '$$chat_receiver_id'] },
            //                                     { $eq: ['$receiver_id', '$$chat_sender_id'] },
            //                                     { $eq: ['$status', 1] }
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 }
            //             }
            //         ],
            //         as: 'invitation_details'
            //     }
            // },
            // // Filter those messages where invitation details exist and are accepted
            // {
            //     $match: {
            //         'invitation_details.status': 1
            //     }
            // },
            // {
            //     $project: {
            //         chatId: '$_id',
            //         otherParty: {
            //             $cond: [
            //                 { $eq: ['$sender_id', user._id] },
            //                 '$receiver_id',
            //                 '$sender_id',
            //             ],
            //         },
            //         lastMessage: '$message',
            //         timestamp: '$created_at',
            //     },
            // },
            // {
            //     $group: {
            //         _id: '$otherParty',
            //         chatId: { $first: '$chatId' },
            //         lastMessage: { $last: '$lastMessage' },
            //         timestamp: { $last: '$timestamp' },
            //     },
            // },
            // {
            //     $sort: { timestamp: -1 },
            // }
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