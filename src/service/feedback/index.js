
const { responseData, messageConstants } = require("../../constants");
const { logger } = require("../../utils");
const FeedbackSchema = require('../../models/feedback');
const OfferSchema = require('../../models/offers');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


// const postFeedback = async (body, userData, res) => {
//     console.log({
//         "userdata": userData,
//         "body": body
//     });
//     const { job_id, sender_id, reciever_id } = body;
//     const feedbackSchema = new FeedbackSchema(body);

//     return new Promise(async () => {
//         if (userData.role === 1) {
//             const existingOffer = await OfferSchema.findOne({
//                 freelencer_id: new ObjectId(sender_id),
//                 client_id: new ObjectId(reciever_id),
//                 job_id: new ObjectId(job_id),
//             });

//             console.log(existingOffer);

//             if (!existingOffer) {
//                 // Offer not found
//                 logger.error(`${messageConstants.NOT_FOUND}`);
//                 return responseData.fail(res, "You're not eligible anymore to make review", 404);
//             }

//             if (existingOffer.status !== 'accepted') {
//                 logger.error("You can't make any feedback, please accept the job offer");
//                 return responseData.fail(
//                     res, "You can make any feedback, please accept the job offer or login with correct account", 400
//                 );
//             }

//             await OfferSchema.find(
//                 {
//                     $and: [
//                         { freelencer_id: new ObjectId(sender_id) },
//                         { job_id: new ObjectId(job_id) },
//                         { client_id: new ObjectId(reciever_id) }
//                     ]
//                 }
//             ).then(async (result) => {
//                 if (result.length !== 0) {
//                     await OfferSchema.findOneAndUpdate(
//                         {
//                             $and: [
//                                 { freelencer_id: new ObjectId(sender_id) },
//                                 { job_id: new ObjectId(job_id) },
//                                 { client_id: new ObjectId(reciever_id) }
//                             ]
//                         },
//                         { $set: { status: "completed" } },
//                         { new: true }
//                     )
//                 } else {
//                     logger.error("You are not allow to perform action");
//                     return responseData.fail(res, "You are not allow to send feedack", 400);
//                 }
//             })

//             await feedbackSchema.save().then((result) => {
//                 logger.info(`${messageConstants.FEEDBACK_SAVED_SUCCESSFULLY}`);
//                 return responseData.success(res, result, messageConstants.FEEDBACK_SAVED_SUCCESSFULLY);
//             }).catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             })
//         }

//         if (userData.role === 2) {
//             const existingOffer = await OfferSchema.findOne({
//                 freelencer_id: new ObjectId(reciever_id),
//                 client_id: new ObjectId(sender_id),
//                 job_id: new ObjectId(job_id),
//             });

//             if (!existingOffer) {
//                 // Offer not found
//                 logger.error(`${messageConstants.NOT_FOUND}`);
//                 return responseData.fail(res, "You're not eligible anymore to make review", 404);
//             }

//             if (existingOffer.status !== 'accepted') {
//                 logger.error("You can't make any feedback, please accept the job offer");
//                 return responseData.fail(
//                     res, "You can make any feedback, please accept the job offer or login with correct account", 400
//                 );
//             }

//             await OfferSchema.find(
//                 {
//                     $and: [
//                         { freelencer_id: new ObjectId(reciever_id) },
//                         { job_id: new ObjectId(job_id) },
//                         { client_id: new ObjectId(sender_id) }
//                     ]
//                 }
//             ).then(async (result) => {
//                 if (result.length !== 0) {
//                     await OfferSchema.findOneAndUpdate(
//                         {
//                             $and: [
//                                 { freelencer_id: new ObjectId(reciever_id) },
//                                 { job_id: new ObjectId(job_id) },
//                                 { client_id: new ObjectId(sender_id) }
//                             ]
//                         },
//                         { $set: { status: "completed" } },
//                         { new: true }
//                     )
//                 } else {
//                     logger.error("You are not allow to perform action");
//                     return responseData.fail(res, "You are not allow to send feedack", 400);
//                 }
//             })

//             await feedbackSchema.save().then((result) => {
//                 logger.info(`${messageConstants.FEEDBACK_SAVED_SUCCESSFULLY}`);
//                 return responseData.success(res, result, messageConstants.FEEDBACK_SAVED_SUCCESSFULLY);
//             }).catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             })
//         }
//     })
// }

const postFeedback = (body, userData, res) => {
    console.log({
        "userdata": userData,
        "body": body
    });

    const { job_id, sender_id, reciever_id } = body;
    const feedbackSchema = new FeedbackSchema(body);

    return new Promise(async (resolve, reject) => {
        try {
            const existingOffer = await OfferSchema.findOne({
                freelencer_id: new ObjectId(userData.role === 1 ? sender_id : reciever_id),
                client_id: new ObjectId(userData.role === 1 ? reciever_id : sender_id),
                job_id: new ObjectId(job_id),
                status: 'accepted'
            });

            if (!existingOffer) {
                logger.error(`${messageConstants.NOT_FOUND}`);
                reject(responseData.fail(res, "You're not eligible anymore to make a review", 404));
                return;
            }

            await OfferSchema.findOneAndUpdate(
                {
                    $and: [
                        { freelencer_id: new ObjectId(sender_id) },
                        { job_id: new ObjectId(job_id) },
                        { client_id: new ObjectId(reciever_id) }
                    ]
                },
                { $set: { status: "completed" } },
                { new: true }
            );

            const savedFeedback = await feedbackSchema.save();

            logger.info(`${messageConstants.FEEDBACK_SAVED_SUCCESSFULLY}`);
            resolve(responseData.success(res, savedFeedback, messageConstants.FEEDBACK_SAVED_SUCCESSFULLY));
        } catch (error) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
            reject(responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`, 500));
        }
    });
};



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