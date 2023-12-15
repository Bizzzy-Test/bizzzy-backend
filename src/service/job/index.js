const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const JobSchema = require("../../models/job")
const { logger } = require("../../utils");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ==== create job post ==== service
const createJobPost = async (req, userData, taskFile, res) => {
    return new Promise(async () => {
        req.body['client_detail'] = userData._id
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

// ==== get all job post ==== service
const getAllJobPost = async () => {
    try {
        const jobSchema = await JobSchema.find().populate('client_detail');
        return jobSchema;
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error
    }
}

// ==== search job post ==== service
const searchJobPosts = async (payload, userToken) => {
    const { searchQuery, budget, experience, sort } = payload;
    const user = jwt.decode(userToken);

    let baseQuery = {};

    // Regular filters based on user role (freelancer or client)
    if (user.role === 1) {
        if (budget) {
            baseQuery.budget = budget;
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
            if (body?.experience == '' && body?.budget == '' && body?.category?.length == 0 && body?.skills?.length == 0 && body?.title == '' && body?.description == '') {
                result = await JobSchema.find({});
            } else {
                result = await JobSchema.find({
                    $or: [
                        // {experience: body?.experience},
                        // {budget: body?.budget},
                        { tags: { $in: body?.category?.map(category => new RegExp(category, 'i')) } },
                        { skills: { $in: body?.skills?.map(skills => new RegExp(skills, 'i')) } },
                        { experience: body?.experience },
                        { budget: body?.budget },
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
const getSingleJobPost = async (jobId) => {
    try {
        const jobSchema = await JobSchema.findById({ _id: jobId }).populate('client_detail');
        return jobSchema;
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error
    }
}


// ==== get job post by user id ==== service
const getJobPostByUserId = async (req, userData, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: { client_detail: userData._id.toString() }
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
const updateJobPost = async (body, jobId, userToken) => {
    try {
        const user = jwt.decode(userToken);

        if (user.role !== "2" && user._id !== body.client_detail) {
            throw new Error(messageConstants.USER_NOT_AUTHORIZED);
        }

        const updatedJob = await JobSchema.findByIdAndUpdate(jobId, body, { new: true })

        if (!updatedJob) {
            throw new Error(messageConstants.JOB_NOT_FOUND);
        }

        logger.info(messageConstants.JOB_UPDATED_SUCCESSFULLY);
        return updatedJob;
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        throw new Error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
    }
};
// 

// ==== delete job post ==== service
const deleteJobPost = async (jobId, userToken) => {
    const ObjectId = mongoose.Types.ObjectId;
    jobId = new ObjectId(jobId)
    const user = jwt.decode(userToken);
    if (user.role !== 2) {
        logger.error(`${messageConstants.USER_NOT_AUTHORIZED}`);
        throw new Error(`${messageConstants.USER_NOT_AUTHORIZED}`);
    } else {
        const data = await JobSchema.findByIdAndDelete(jobId);
        return data;
    }
}


module.exports = {
    createJobPost,
    getAllJobPost,
    getJobPostByUserId,
    updateJobPost,
    deleteJobPost,
    searchJobPost,
    getSingleJobPost,
};