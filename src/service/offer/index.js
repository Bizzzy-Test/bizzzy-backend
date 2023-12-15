
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const InviteSchema = require('../../models/invite');
const UserSchema = require('../../models/users');
const OfferSchema = require('../../models/offers');
const JobSchema = require('../../models/job');
const ClientSchema = require('../../models/clientProfile');
const { logger, mail } = require('../../utils');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Send user invite
const sendOffer = async (body, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            const find_offer = await OfferSchema.findOne(
                {
                    $and: [
                        { freelencer_id: new ObjectId(body.freelencer_id) },
                        { client_id: userData._id },
                        { job_id: new ObjectId(body.job_id) }
                    ]
                })
            if (find_offer) {
                logger.info(`Offer ${messageConstants.ALREADY_EXIST}`);
                return responseData.fail(res, `Offer ${messageConstants.ALREADY_EXIST}`, 403);
            } else {
                body.freelencer_id=new ObjectId(body.freelencer_id);
                body.job_id=new ObjectId(body.job_id);
                body.client_id=userData._id;
                const offerSchema = new OfferSchema({ ...body });
                await offerSchema.save().then(async (result) => {
                    const find_freelencer = await UserSchema.findOne({ _id:new ObjectId(body.freelencer_id) });
                    if(find_freelencer){
                        const client_details = await ClientSchema.findOne({ userId: userData._id });
                        if(client_details){
                            const job_details = await JobSchema.findOne({ client_detail: userData._id.toString() });
                            if(job_details){
                                const mailContent = {
                                    name: find_freelencer.firstName +' '+ find_freelencer.lastName,
                                    client_name: client_details.firstName + client_details.lastName,
                                    job_title: job_details.title,
                                    job_description: job_details.description,
                                    business_name: client_details.businessName,
                                    budget:job_details.budget,
                                    email: find_freelencer.email,
                                    message: body.client_message,
                                    link: `${process.env.BASE_URL}message/offer?job_id=${body.job_id}&offer_id=${result._id}`,

                                };
                                await mail.sendMailtoUser(mailTemplateConstants.SEND_OFFER, find_freelencer.email, "Job Offer", res, mailContent);
                                logger.info(messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
                                return responseData.success(res, result, messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
                            }else{
                                logger.info(`Job ${messageConstants.NOT_FOUND}`);
                                return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                            }
                        }else{
                            logger.info(`Client ${messageConstants.NOT_FOUND}`);
                            return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                        }
                    }else{
                        logger.error(`Freelancer ${messageConstants.NOT_FOUND}`);
                        return responseData.fail(res, `Freelancer ${messageConstants.NOT_FOUND}`, 403);
                    }
                }).catch((err) => {
                        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                })
            }
        } else {
            logger.info(messageConstants.NOT_SENT_OFFER);
            return responseData.fail(res, `${messageConstants.NOT_SENT_OFFER}`, 401);
        }
    })
}

const getOffersList = async (userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            const query = [
                {
                    $match: {
                        $and:[
                            { client_id: new ObjectId(userData._id) },
                            { status: 0}
                        ]
                    }
                },
                {
                    $lookup: {
                      from: 'freelencer_profiles',
                      localField: 'freelencer_id',
                      foreignField: 'user_id',
                      pipeline: [
                        { 
                            $project: { 
                                _id: 1, 
                                user_id: 1, 
                                name: { $concat: ["$firstName", " ", "$lastName"] },
                                professional_role: 1, 
                                profile_image: 1, 
                                hourly_rate: 1 
                            } 
                        }
                    ],
                      as: 'freelancerDetails'
                    }
                }
            ]
            await OfferSchema.aggregate(query).then(async (result) => {
                if (result.length !== 0) {
                    logger.info(`Get User Offer details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                    return responseData.success(res, result, `Get User Offer details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                } else {
                    logger.info(`User ${messageConstants.OFFERS_DETAILS_NOT_FOUND}`);
                    return responseData.fail(res, `User ${messageConstants.OFFERS_DETAILS_NOT_FOUND}`, 200);
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

const updateOffer = async (req, res) => {
    return new Promise(async () => {
        const { offer_id, status, job_id } = req.body;
        await OfferSchema.find(
            {
                $and: [
                    { freelencer_id: new ObjectId(req.userId) },
                    { job_id: new ObjectId(job_id) },
                    { _id: new ObjectId(offer_id) }
                ]
            }
        ).then(async (result) => {
            if (result.length !== 0) {
                await OfferSchema.findOneAndUpdate(
                    {
                        $and: [
                            { _id: new ObjectId(offer_id) },
                            { freelencer_id: new ObjectId(req.userId) },
                            { job_id: new ObjectId(job_id) },
                        ]
                    },
                    { $set: { status: status } },
                    { new: true }
                ).then((result) => {
                    if (result.length !== 0) {
                        logger.info(messageConstants.OFFER_UPDATED_SUCCESSFULLY);
                        return responseData.success(res, result, messageConstants.OFFER_UPDATED_SUCCESSFULLY);
                    } else {
                        logger.error(`Offer ${messageConstants.NOT_FOUND}`);
                        return responseData.success(res, [], messageConstants.NOT_FOUND);
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

const getHiredList = async (userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            const query = [
                {
                    $match: {
                        $and:[
                            { client_id: new ObjectId(userData._id) },
                            { status: 1}
                        ]
                    }
                },
                {
                    $lookup: {
                      from: 'freelencer_profiles',
                      localField: 'freelencer_id',
                      foreignField: 'user_id',
                      pipeline: [
                        { 
                            $project: { 
                                name: { $concat: ["$firstName", " ", "$lastName"] },
                                profile_image: 1, 
                                title: 1
                            } 
                        }
                    ],
                      as: 'freelancerDetails'
                    }
                }
            ]
            await OfferSchema.aggregate(query).then(async (result) => {
                if (result.length !== 0) {
                    logger.info(`Get User hired details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                    return responseData.success(res, result, `Get User hired details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                } else {
                    logger.info(`User ${messageConstants.HIRED_DETAILS_NOT_FOUND}`);
                    return responseData.fail(res, `User ${messageConstants.HIRED_DETAILS_NOT_FOUND}`, 200);
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

const getJobHiredList = async (userData, req, res) => {
    return new Promise(async () => {
        const { job_id } = req.query;

        if (userData.role == 2) {
            const query = [
                {
                    $match: {
                        $and:[
                            { client_id: new ObjectId(userData._id) },
                            { job_id: new ObjectId(job_id)},
                            { status: 1}
                        ]
                    }
                },
                {
                    $lookup: {
                      from: 'freelencer_profiles',
                      localField: 'freelencer_id',
                      foreignField: 'user_id',
                      pipeline: [
                        { 
                            $project: { 
                                name: { $concat: ["$firstName", " ", "$lastName"] },
                                profile_image: 1, 
                                title: 1
                            } 
                        }
                    ],
                      as: 'freelancerDetails'
                    }
                }
            ]
            await OfferSchema.aggregate(query).then(async (result) => {
                if (result.length !== 0) {
                    logger.info(`Get User hired details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                    return responseData.success(res, result, `Get User hired details ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                } else {
                    logger.info(`User ${messageConstants.HIRED_DETAILS_NOT_FOUND}`);
                    return responseData.fail(res, `User ${messageConstants.HIRED_DETAILS_NOT_FOUND}`, 200);
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

module.exports = {
    sendOffer,
    getOffersList,
    updateOffer,
    getHiredList,
    getJobHiredList
}