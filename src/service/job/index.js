const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const JobSchema = require("../../models/job")
const { logger } = require("../../utils");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { getClientDetails } = require("../profile");
const ObjectId = mongoose.Types.ObjectId;

// ==== create job post ==== service
const createJobPost = async (req, userData, taskFile, res) => {
    return new Promise(async () => {
        req.body['client_id'] = userData._id
        req.body['file'] = taskFile
        if (userData.role == 2) {
            const jobSchema = new JobSchema(req.body);
            await jobSchema.save().then(async (result) => {
                logger.info('job created successfully');
                return responseData.success(res, result, 'job created successfully');
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error('Only client can create new job');
            return responseData.fail(res, 'Only client can create new job', 401);
        }
    })
};

const closeJob = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData.role !== 2) {
            logger.error('Only client can close the job');
            return responseData.fail(res, 'Only client can close the job', 401);
        } else {
            await JobSchema.updateOne(
                {
                    client_id: userData._id,
                    _id: new ObjectId(req.body.job_id)
                },
                { $set: { status: 'closed' } },
                { new: true }
            ).then((result) => {
                if (result?.modifiedCount !== 0) {
                    logger.info('Job closed successfully');
                    return responseData.success(res, result, 'Job closed successfully');
                } else if (result?.matchedCount !== 0) {
                    logger.info("Job already closed");
                    return responseData.success(res, result, "Job already closed");
                } else {
                    logger.error('Job Not Found');
                    return responseData.success(res, result, 'Job Not Found');
                }
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        }
    })
};

// ==== get all job post ==== service
const getAllJobPost = async () => {
    try {
        const jobSchema = await JobSchema.find({ status: { $ne: 'closed' } }).populate({
            path: 'client_id',
            select: 'country firstName lastName',
        });

        return jobSchema;
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error;
    }
};


// ==== search job post ==== service
const searchJobPosts = async (payload, userToken) => {
    const { searchQuery, job_type, experience, sort } = payload;
    const user = jwt.decode(userToken);

    let baseQuery = {};

    // Regular filters based on user role (freelancer or client)
    if (user.role === 1) {
        if (job_type) {
            baseQuery.job_type = job_type;
        }
        if (experience) {
            baseQuery.experience = experience;
        }
    } else if (user.role === 2) {
        // Add filters for clients if needed
    }

    let searchResults = [];

    if (searchQuery) {
        const searchKeywords = searchQuery.trim().toLowerCase().split(' ');

        // Define a pipeline for the aggregation
        const pipeline = [];

        // Stage 1: Match documents with matching title or tags
        pipeline.push({
            $match: {
                $or: [
                    { title: { $in: searchKeywords } },
                    { tags: { $in: searchKeywords } },
                ],
                ...baseQuery, // Apply regular filters
            },
        });

        // Stage 2: Add a relevance score based on the number of keyword matches
        pipeline.push({
            $addFields: {
                relevance: {
                    $size: {
                        $setIntersection: [searchKeywords, '$title', '$tags'],
                    },
                },
            },
        });

        // Stage 3: Sort by relevance score in descending order
        pipeline.push({ $sort: { relevance: -1 } });

        // Execute the aggregation pipeline
        searchResults = await JobModel.aggregate(pipeline);
    }

    // Regular filters
    const query = { ...baseQuery };

    const sortOptions = {};

    if (sort === 'budget-low-to-high') {
        sortOptions.amount = 1; // Sort by budget in ascending order
    } else if (sort === 'budget-high-to-low') {
        sortOptions.amount = -1; // Sort by budget in descending order
    } else if (sort === 'experience') {
        sortOptions.experience = 1; // Sort by experience level (ascending)
    } else if (sort === 'latest') {
        sortOptions.createdAt = -1; // Sort by the latest job postings
    } else {
        // Default sorting criteria
        sortOptions.createdAt = -1; // Sort by the latest job postings
    }

    const jobs = await JobModel.find(query).sort(sortOptions).exec();

    // Merge regular filter results with search results
    const mergedResults = [...searchResults, ...jobs];

    return mergedResults;
};

const searchJobPost = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            logger.info(`Search Job Post ${messageConstants.NOT_ALLOWED}`);
            return responseData.fail(res, `${messageConstants.NOT_ALLOWED}`, 404);
        } else {
            const body = req.body;
            let result;
            if (body?.experience == '' && body?.job_type == '' && body?.category?.length == 0 && body?.skills?.length == 0 && body?.title == '' && body?.description == '') {
                result = await JobSchema.find({});
            } else {
                result = await JobSchema.find({
                    $or: [
                        // {experience: body?.experience},
                        // {budget: body?.budget},
                        { tags: { $in: body?.category?.map(category => new RegExp(category, 'i')) } },
                        { skills: { $in: body?.skills?.map(skills => new RegExp(skills, 'i')) } },
                        { experience: body?.experience },
                        { job_type: body?.job_type },
                        { title: { $regex: body?.title, $options: 'i' } },
                        { description: { $regex: body?.description, $options: 'i' } },
                    ]
                });
            }
            if (result.length > 0) {
                logger.info(`Search Job Post ${messageConstants.DATA_FOUND}`);
                return responseData.success(res, result, `Search Job Post ${messageConstants.DATA_FOUND}`);
            } else {
                logger.info(`Search Job Post ${messageConstants.LIST_NOT_FOUND}`);
                return responseData.success(res, [], `${messageConstants.LIST_NOT_FOUND}`, 200);
            }
        }
    })
}
// ==== get single job post ==== service
const getSingleJobPost = async (req, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: {
                    _id: new ObjectId(req.query.job_id)
                }
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    localField: 'client_id',
                    foreignField: 'user_id',
                    as: 'client_details'
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'client_id',
                    foreignField: 'client_id',
                    as: 'client_history'
                }
            }
        ];
        await JobSchema.aggregate(query).then(async (result) => {
            if (result) {
                result[0].client_details[0] = await getClientDetails(result[0]?.client_details[0], result[0]?.client_details[0]?.user_id);
                logger.info(messageConstants.JOB_FETCHED_SUCCESSFULLY);
                return responseData.success(res, result, messageConstants.JOB_FETCHED_SUCCESSFULLY);
            } else {
                logger.error(`Job not found`);
                return responseData.fail(res, `Job not found`, 200);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}


// ==== get job post by user id ==== service
const getJobPostByUserId = async (req, userData, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: { client_id: userData._id }
            },
            {
                $lookup: {
                    from: 'job_proposals',
                    let: { jobId: { $toString: '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: [{ $toString: '$jobId' }, '$$jobId'] }
                            }
                        }
                    ],
                    as: 'proposal_details'
                }
            },
        ];
        await JobSchema.aggregate(query).then(async (result) => {
            return responseData.success(res, result, `job fetched succesfully with proposals`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

// ==== update job post ==== service
const updateJobPost = async (req, userData, fileUrl, res) => {
    return new Promise(async () => {
        const job_id = new ObjectId(req.query.job_id);
        await JobSchema.findOne(
            {
                _id: job_id,
                client_id: userData._id
            }
        ).then(async (result) => {
            if (result) {
                req.body['file'] = fileUrl || result.file;
                await JobSchema.findOneAndUpdate(
                    {
                        _id: job_id,
                        client_id: userData._id
                    },
                    req.body,
                    { new: true, upsert: true }
                ).then((result) => {
                    if (result) {
                        logger.info('Job updated successfully');
                        return responseData.success(res, result, 'job updated successfully');
                    } else {
                        logger.error('Job not updated');
                        return responseData.fail(res, 'Job not updated', 401);
                    }
                }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
                })
            } else {
                logger.error('Job not found');
                return responseData.fail(res, 'Job not found', 200);
            }
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}.${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}.${err}`, 500);
        })
    })
};

// ==== delete job post ==== service
const deleteJobPost = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData?.role == 2) {
            await JobSchema.deleteOne(
                {
                    _id: new ObjectId(req.query.job_id),
                    client_id: userData._id
                }
            ).then(async (result) => {
                if (result?.deletedCount !== 0) {
                    logger.info('Job Deleted successfully');
                    return responseData.success(res, result, 'Job Deleted successfully');
                } else {
                    logger.error('Job Not Found');
                    return responseData.fail(res, 'Job Not Found', 200);
                }
            }).catch((err) => {
                console.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error('Only Client can delete the job');
            return responseData.fail(res, 'Only Client can delete the job', 500);
        }
    })
}


module.exports = {
    createJobPost,
    getAllJobPost,
    getJobPostByUserId,
    updateJobPost,
    deleteJobPost,
    searchJobPost,
    getSingleJobPost,
    closeJob
};