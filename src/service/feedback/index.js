
const { responseData, messageConstants } = require("../../constants");
const { logger } = require("../../utils");
const FeedbackSchema = require('../../models/feedback');
const mongoose = require('mongoose');

const postFeedback = async (body, userData, res) => {
    console.log({
        "userdata": userData,
        "body": body
    });

    return new Promise(async () => {
        body['sender_id'] = userData._id
        const feedbackSchema = new FeedbackSchema(body);
        if (userData.role === 1) { } else { }
        await feedbackSchema.save().then((result) => {
            logger.info(`${messageConstants.FEEDBACK_SAVED_SUCCESSFULLY}`);
            return responseData.success(res, result, messageConstants.FEEDBACK_SAVED_SUCCESSFULLY);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getFeedback = async (req, userData, res) => {
    return new Promise(async () => {
        const project = {
            _id: 0,
            user_id: 1,
            firstName: 1,
            lastName: 1,
            location: 1,
            businessName: 1,
            profile_image: 1
        }
        const query = [
            {
                $match: {
                    $or: [
                        { reciever_id: new mongoose.Types.ObjectId(req.query.user_id) },
                        { reciever_id: new mongoose.Types.ObjectId(userData._id) }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'freelencer_profiles',
                    localField: 'sender_id',
                    foreignField: 'user_id',
                    pipeline: [
                        {
                            $project: project
                        }
                    ],
                    as: 'freelencer_profiles'
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'sender_id',
                    foreignField: 'user_id',
                    pipeline: [
                        {
                            $project: project
                        }
                    ],
                    as: 'client_details'
                }
            },
            {
                $addFields: {
                    user_details: {
                        $ifNull: [
                            { $arrayElemAt: ['$freelencer_profiles', 0] },
                            { $arrayElemAt: ['$client_details', 0] }
                        ]
                    },
                }
            },
            {
                $project: {
                    freelencer_profiles: 0,
                    client_details: 0,
                }
            }
        ];
        await FeedbackSchema.aggregate(query).then(async (result) => {
            logger.info('Feedback list fetched succesfully');
            return responseData.success(res, result, `Feedback list fetched succesfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

module.exports = {
    postFeedback,
    getFeedback
}