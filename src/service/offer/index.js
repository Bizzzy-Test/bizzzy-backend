
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const OfferTaskSchema = require('../../models/offer_task');
const UserSchema = require('../../models/users');
const OfferSchema = require('../../models/offers');
const JobSchema = require('../../models/job');
const HiredFreelancersSchema = require('../../models/hiredFreelancers');
const ClientSchema = require('../../models/clientProfile');
const { logger, mail } = require('../../utils');
const mongoose = require("mongoose");
const { getClientDetails } = require('../profile');
const ObjectId = mongoose.Types.ObjectId;
const JobProposalSchema = require('../../models/jobProposal');

// Send user invite
const sendOffer = async (body, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            const find_offer = await OfferSchema.findOne(
                {
                    $and: [
                        { freelancer_id: new ObjectId(body.freelancer_id) },
                        { client_id: userData._id },
                        { job_id: new ObjectId(body.job_id) }
                    ]
                })
            if (find_offer) {
                logger.info(`Offer ${messageConstants.ALREADY_EXIST}`);
                return responseData.fail(res, `Offer ${messageConstants.ALREADY_EXIST}`, 403);
            } else {
                body.freelancer_id = new ObjectId(body.freelancer_id);
                body.job_id = new ObjectId(body.job_id);
                body.client_id = userData._id;
                const offerSchema = new OfferSchema({ ...body });
                await offerSchema.save().then(async (result) => {
                    const find_freelancer = await UserSchema.findOne({ _id: new ObjectId(body.freelancer_id) });
                    if (find_freelancer) {
                        const client_details = await ClientSchema.findOne({ user_id: userData._id });
                        if (client_details) {
                            const job_details = await JobSchema.findOne({ client_id: userData._id });
                            if (job_details) {
                                const mailContent = {
                                    name: find_freelancer.firstName + ' ' + find_freelancer.lastName,
                                    client_name: client_details.firstName + client_details.lastName,
                                    job_title: job_details.title,
                                    job_description: job_details.description,
                                    business_name: client_details.businessName,
                                    budget: job_details.job_type,
                                    email: find_freelancer.email,
                                    message: body.client_message,
                                    link: `${process.env.BASE_URL}/message/offer?job_id=${body.job_id}&offer_id=${result._id}`,

                                };
                                await mail.sendMailtoUser(mailTemplateConstants.SEND_OFFER, find_freelancer.email, "Job Offer", res, mailContent);
                                logger.info(messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
                                return responseData.success(res, result, messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
                            } else {
                                logger.info(`Job ${messageConstants.NOT_FOUND}`);
                                return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                            }
                        } else {
                            logger.info(`Client ${messageConstants.NOT_FOUND}`);
                            return responseData.fail(res, `${messageConstants.NOT_FOUND}`, 400);
                        }
                    } else {
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
                        $and: [
                            { client_id: new ObjectId(userData._id) },
                            { status: 'pending' }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'freelancer_profiles',
                        localField: 'freelancer_id',
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

const updateOfferStatus = async (req, userData, res) => {
    return new Promise(async () => {
        await OfferSchema.find(
            {
                _id: req?.body?.offer_id ? new ObjectId(req?.body?.offer_id) : new ObjectId(req?.query?.offer_id)
            }
        ).then(async (result) => {
            if (result.length !== 0) {
                let offerData = result[0];
                await OfferSchema.updateOne(
                    {
                        _id: req?.body?.offer_id ? new ObjectId(req?.body?.offer_id) : new ObjectId(req?.query?.offer_id)
                    },
                    { $set: { status: 'accepted' } },
                    { new: true }
                ).then(async (result) => {
                    if (result?.modifiedCount !== 0) {
                        offerData = { ...offerData.toObject() };
                        await HiredFreelancersSchema.find(
                            {
                                freelancer_id: new ObjectId(offerData.freelancer_id),
                                client_id: new ObjectId(offerData.client_id),
                                job_id: new ObjectId(offerData.job_id)
                            }
                        ).then(async (result) => {
                            if (result?.length !== 0) {
                                logger.info('Freelancer already hired for this job')
                            } else {
                                delete offerData._id;
                                offerData.status = 'accepted';
                                const hiredFreelancersSchema = new HiredFreelancersSchema(offerData);
                                await hiredFreelancersSchema.save().then(async (result) => {
                                    logger.info('Freelancer added in the hired list')
                                });
                            }
                        })

                        logger.info(messageConstants.OFFER_UPDATED_SUCCESSFULLY);
                        return responseData.success(res, result, messageConstants.OFFER_UPDATED_SUCCESSFULLY);
                    } else if (result?.matchedCount !== 0) {
                        logger.info("Offer already Updated");
                        return responseData.success(res, result, "Offer already Updated");
                    } else {
                        logger.error(`Offer ${messageConstants.NOT_FOUND}`);
                        return responseData.success(res, result, `Offer ${messageConstants.NOT_FOUND}`);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
                })
            }
        })
    })
}

const getHiredList = async (userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            const query = [
                {
                    $match: {
                        $and: [
                            { client_id: new ObjectId(userData._id) },
                            { status: 'accepted' }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'freelancer_profiles',
                        localField: 'freelancer_id',
                        foreignField: 'user_id',
                        pipeline: [
                            {
                                $project: {
                                    name: { $concat: ["$firstName", " ", "$lastName"] },
                                    profile_image: 1,
                                    professional_role: 1
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
                        $and: [
                            { client_id: new ObjectId(userData._id) },
                            { job_id: new ObjectId(job_id) },
                            { status: 'accepted' }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'freelancer_profiles',
                        localField: 'freelancer_id',
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

// const getUsersJobs = async (req, userData, res) => {
//     return new Promise(async () => {
//         const query = [
//             {
//                 $match: {
//                     $and: [
//                         { freelancer_id: userData._id, },
//                         { status: 'accepted' }
//                     ]
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'client_profiles',
//                     localField: 'client_id',
//                     foreignField: 'user_id',
//                     pipeline: [
//                         {
//                             $project: {
//                                 _id: 0,
//                                 user_id: 1,
//                                 firstName: 1,
//                                 lastName: 1,
//                                 location: 1,
//                                 profile_image: 1,
//                                 businessName: 1
//                             }
//                         }
//                     ],
//                     as: 'client_profile'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'jobs',
//                     localField: 'job_id',
//                     foreignField: '_id',
//                     pipeline: [
//                         {
//                             $project: {
//                                 _id: 0,
//                                 title: 1,
//                                 description: 1,
//                                 amount: 1,
//                                 job_type: 1,
//                                 experience: 1,
//                             }
//                         }
//                     ],
//                     as: 'job_details'
//                 }
//             }
//         ];
//         await OfferSchema.aggregate(query).then(async (result) => {
//             if (result.length !== 0) {
//                 logger.info(`Accepted Offer ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
//                 return responseData.success(res, result, `Accepted Offer ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
//             } else {
//                 logger.info(`Accepted Offer${messageConstants.LIST_NOT_FOUND}`);
//                 return responseData.success(res, [], `Accepted Offer ${messageConstants.LIST_NOT_FOUND}`);
//             }
//         }).catch((err) => {
//             logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//             return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//         })
//     })
// }

// const getUsersJobs = async (req, userData, res) => {
//     return new Promise(async () => {
//         const query = [
//             {
//                 $match: {
//                     freelancer_id: userData._id,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'client_profiles',
//                     localField: 'client_id',
//                     foreignField: 'user_id',
//                     pipeline: [
//                         {
//                             $project: {
//                                 _id: 0,
//                                 user_id: 1,
//                                 firstName: 1,
//                                 lastName: 1,
//                                 location: 1,
//                                 profile_image: 1,
//                                 businessName: 1,
//                             },
//                         },
//                     ],
//                     as: 'client_profile',
//                 },
//             },
//             {
//                 $lookup: {
//                     from: 'jobs',
//                     localField: 'job_id',
//                     foreignField: '_id',
//                     pipeline: [
//                         {
//                             $project: {
//                                 _id: 0,
//                                 title: 1,
//                                 description: 1,
//                                 amount: 1,
//                                 job_type: 1,
//                                 experience: 1,
//                                 status: 1, // Include the 'status' field in the project stage
//                             },
//                         },
//                     ],
//                     as: 'job_details',
//                 },
//             },
//         ];

//         await OfferSchema.aggregate(query)
//             .then(async (result) => {
//                 const activeJobs = [];
//                 const completedJobs = [];
//                 console.log(result);
//                 result.forEach((offer) => {
//                     if (offer.job_details.length > 0) {
//                         const job = offer.job_details[0];
//                         console.log({ "job---": job });
//                         const jobWithClientProfile = {
//                             ...job,
//                             client_profile: offer.client_profile[0],
//                         };

//                         if (offer.status == 'accepted') {
//                             activeJobs.push(jobWithClientProfile);
//                         } else if (offer.status == 'completed') {
//                             completedJobs.push(jobWithClientProfile);
//                         }
//                     }
//                 });

//                 const response = {
//                     active_jobs: activeJobs,
//                     completed_jobs: completedJobs,
//                 };

//                 if (activeJobs.length > 0 || completedJobs.length > 0) {
//                     logger.info(`Jobs fetched successfully`);
//                     return responseData.success(res, response, `Jobs fetched successfully`);
//                 } else {
//                     logger.info(`No jobs found`);
//                     return responseData.success(res, response, `No jobs found`);
//                 }
//             })
//             .catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             });
//     });
// };


const getUsersJobs = async (req, userData, res) => {
    return new Promise(async () => {
        try {
            // Query to fetch offers with client profiles and job details
            const offerQuery = [
                {
                    $match: {
                        freelancer_id: userData._id,
                    },
                },
                {
                    $lookup: {
                        from: 'client_profiles',
                        localField: 'client_id',
                        foreignField: 'user_id',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    user_id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    location: 1,
                                    profile_image: 1,
                                    businessName: 1,
                                },
                            },
                        ],
                        as: 'client_profile',
                    },
                },
                {
                    $lookup: {
                        from: 'jobs',
                        localField: 'job_id',
                        foreignField: '_id',
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    title: 1,
                                    description: 1,
                                    amount: 1,
                                    job_type: 1,
                                    experience: 1,
                                    status: 1, // Include the 'status' field in the project stage
                                },
                            },
                        ],
                        as: 'job_details',
                    },
                },
            ];

            // Aggregate offers using the offerQuery
            const offers = await OfferSchema.aggregate(offerQuery);

            const jobProposals = await JobProposalSchema.find({ userId: userData._id }).populate('jobId');

            // Extract job details from the populated job proposals
            const jobDetails = jobProposals.map((proposal) => proposal.jobId);

            // Fetch applied job proposals using the getAppliedJobProposals function

            // Separate jobs into active and completed based on status
            const activeJobs = [];
            const completedJobs = [];

            for (let offer of offers) {
                if (offer.job_details.length > 0) {
                    const job = offer.job_details[0];
                    const client_profile = await getClientDetails(offer?.client_profile[0], offer?.client_profile[0]?.user_id);
                    const jobWithClientProfile = {
                        ...job, client_profile
                    };
                    if (offer.status === 'accepted') {
                        activeJobs.push(jobWithClientProfile);
                    } else if (offer.status === 'completed') {
                        completedJobs.push(jobWithClientProfile);
                    }
                }
            }

            // Combine the results into a response object
            const response = {
                active_jobs: activeJobs,
                completed_jobs: completedJobs,
                applied_jobs: jobDetails,
            };

            // Send the response
            if (activeJobs.length > 0 || completedJobs.length > 0 || jobProposals.length > 0) {
                logger.info(`Jobs fetched successfully`);
                return responseData.success(res, response, `Jobs fetched successfully`);
            } else {
                logger.info(`No jobs found`);
                return responseData.success(res, response, `No jobs found`);
            }
        } catch (error) {
            // Handle errors and log them
            const errorMessage = `${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`;
            logger.error(errorMessage);
            return responseData.fail(res, errorMessage, 500);
        }
    });
};



const getOfferDetails = async (req, res,) => {
    return new Promise(async () => {
        const { offer_id } = req.query;
        const query = [
            {
                $match: {
                    _id: new ObjectId(offer_id)
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'client_id',
                    foreignField: 'user_id',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                location: 1,
                                user_id: 1,
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
                        { $project: { file: 0, client_id: 0, } }
                    ],
                    as: 'job_details'
                }
            }
        ]
        await OfferSchema.aggregate(query).then(async (result) => {
            result[0].client_details[0] = await getClientDetails(result[0].client_details[0], result[0].client_details[0].user_id)
            if (result.length !== 0) {
                logger.info(`Offer ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
                return responseData.success(res, result, `Offer ${messageConstants.LIST_FETCHED_SUCCESSFULLY}`);
            } else {
                logger.info(`Invitation ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.success(res, [], `Offer ${messageConstants.LIST_NOT_FOUND}`);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const submitOfferTask = async (req, userData, taskFile, res) => {
    return new Promise(async () => {
        req.body['freelancer_id'] = userData._id
        req.body['file'] = taskFile
        const offerTaskSchema = new OfferTaskSchema(req.body);
        await offerTaskSchema.save().then(async (result) => {
            logger.info('Task submitted successfully');
            return responseData.success(res, result, 'Task submitted successfully');
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const endContract = async (req, userData, res) => {
    return new Promise(async () => {
        let query = {};
        if (userData?.role == 2) {
            query = {
                client_id: new ObjectId(userData?._id),
                freelancer_id: new ObjectId(req?.body?.user_id)
            }
        } else {
            query = {
                client_id: new ObjectId(req?.body?.user_id),
                freelancer_id: new ObjectId(userData?._id)
            }
        }
        await OfferSchema.updateOne(
            {
                job_id: new ObjectId(req?.body?.job_id),
                ...query
            },
            { $set: { status: req?.body?.status } },
            { new: true }
        ).then(async (result) => {
            if (result?.modifiedCount !== 0) {
                logger.info('Contract Ended Successfully');
                return responseData.success(res, result, 'Contract Ended Successfully');
            } else {
                logger.error('Contract Not Found');
                return responseData.success(res, result, 'Contract Not Found');
            }
        })
    })
}

module.exports = {
    sendOffer,
    getOffersList,
    updateOfferStatus,
    getHiredList,
    getJobHiredList,
    getUsersJobs,
    submitOfferTask,
    getOfferDetails,
    endContract
}