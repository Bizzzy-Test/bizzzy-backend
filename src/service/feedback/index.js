
const { responseData, messageConstants } = require("../../constants");
const { logger } = require("../../utils");
const FeedbackSchema = require('../../models/feedback');
const mongoose = require('mongoose');

const postFeedback = async (body, res) => {
    return new Promise(async () => {
        const feedbackSchema = new FeedbackSchema(body);
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
        const role = req.query.role;
        let project = role == 2 ?
            {
                _id: 0,
                user_id: 1,
                firstName: 1,
                lastName: 1,
                location: 1,
                professional_role: 1,
                profile_image: 1,
                categories: 1
            } :
            {
                _id: 0,
                userId: 1,
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
                        { user_id_feedbacker: new mongoose.Types.ObjectId(req.query.user_id) },
                        { user_id_feedbacker: userData._id }
                    ]
                }
            },
            {
                $lookup: {
                    from: role == 2 ? 'freelencer_profiles' : 'client_profiles',
                    localField: 'user_id_giver',
                    foreignField: role == 2 ? 'user_id' : 'userId',
                    pipeline: [
                        { $project: project }
                    ],
                    as: role == 2 ? 'freelencer_details' : 'client_details'
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