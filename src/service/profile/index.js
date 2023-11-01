const { responseData, messageConstants } = require("../../constants");
const UserSchema = require('../../models/users');
const ProfileSchema = require('../../models/profile');
const { logger } = require("../../utils");
const path = require('path');
const fs = require('fs');
const { SECRET_KEY_STRIPE } = process.env
const stripe = require('stripe')(SECRET_KEY_STRIPE);
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const userProfile = async (body, res) => {
    return new Promise(async () => {
        const profileSchema = new ProfileSchema(body);
        await UserSchema.find({
            _id: body.user_id
        }).then(async (result) => {
            if (result.length !== 0) {
                await ProfileSchema.find({
                    user_id: body.user_id
                }).then(async (result) => {
                    if (result.length !== 0) {
                        await UserSchema.updateOne({
                            _id: body.user_id
                        }, { $set: { email: body['email'] } }
                        ).then(async (result) => {
                            if (result.length !== 0) {
                                await ProfileSchema.findOneAndUpdate(
                                    {
                                        user_id: body.user_id
                                    },
                                    body, { new: true, upsert: true }
                                ).then(async (result) => {
                                    if (result.length !== 0) {
                                        logger.info(messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
                                        return responseData.success(res, result, messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
                                    } else {
                                        logger.error(messageConstants.PROFILE_NOT_UPDATED);
                                        return responseData.fail(res, messageConstants.PROFILE_NOT_UPDATED, 401);
                                    }
                                }).catch((err) => {
                                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                                })
                            } else {
                                logger.error(messageConstants.PROFILE_NOT_UPDATED);
                                return responseData.fail(res, messageConstants.PROFILE_NOT_UPDATED, 401);
                            }
                        }).catch((err) => {
                            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                            return responseData.fail(res, 'This email is already used', 500);
                        })
                    }
                    else {
                        await profileSchema.save().then(async (result) => {
                            logger.info(messageConstants.PROFILE_SAVED_SUCCESSFULLY);
                            return responseData.success(res, result, messageConstants.PROFILE_SAVED_SUCCESSFULLY);
                        }).catch((err) => {
                            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                        })
                    }
                })
            } else {
                logger.error(`${messageConstants.USER_NOT_FOUND} Please signup and then add profile details.`);
                return responseData.fail(res, `${messageConstants.USER_NOT_FOUND} Please signup and then add profile details.`, 401);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getUserProfile = async (req, res) => {
    return new Promise(async () => {
        // const query = [
        //     {
        //         $match: {
        //             _id: new ObjectId(req.query.user_id || userData._id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "feedbacks",
        //             localField: "_id",
        //             foreignField: "user_id_feedbacker",
        //             pipeline: [
        //                 {
        //                     $lookup: {
        //                         from: "users",
        //                         localField: "user_id_giver",
        //                         foreignField: '_id',
        //                         pipeline: [
        //                             { $project: { _id: 1, firstname: 1, lastname: 1, email: 1 } },
        //                         ],
        //                         as: "feedback_giver_user_details",
        //                     },
        //                 },
        //             ],
        //             as: "feedback_details",
        //         }
        //     }
        // ];

        const query = [
            {
                $match: {
                    _id: new ObjectId(req.query.user_id)
                }
            },
            {
                $lookup: {
                    from: "feedbacks",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toObjectId: "$user_id_feedbacker" }, "$$userId"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { giverId: "$user_id_giver" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: [{ $toString: "$_id" }, "$$giverId"] }
                                        }
                                    },
                                    { $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }
                                ],
                                as: "feedback_giver_user_details"
                            }
                        }
                    ],
                    as: "feedback_details"
                }
            }
        ];

        await UserSchema.aggregate(query).then(async (result) => {
            console.log(result)
            if (result?.length !== 0) {
                logger.info(`User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `User details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`);
                return responseData.fail(res, `User ${messageConstants.PROFILE_DETAILS_NOT_FOUND}`, 200);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getProfileImage = async (req, res) => {
    const profile_image = req.params['profile_image'];

    try {
        const imagePath = path.join('./public/uploads', profile_image);

        console.log(imagePath)
        if (!fs.existsSync(imagePath)) {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. File not exists`);
            return null;
        }

        return imagePath;

        // logger.info(messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
        // return responseData.success(res, result, messageConstants.PROFILE_UPDATED_SUCCESSFULLY);
    } catch (err) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
        return null;
    }


    // Assuming the image files are stored in a folder named "uploads"

    // Check if the image file exists

}

module.exports = {
    userProfile,
    getUserProfile,
    getProfileImage
}