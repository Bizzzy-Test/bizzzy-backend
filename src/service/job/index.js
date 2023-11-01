const { responseData, messageConstants } = require("../../constants");
const JobSchema = require("../../models/job")
const { logger } = require("../../utils");
const jwt = require('jsonwebtoken');

// ==== create job post ==== service
const createJobPost = async (payload, userToken) => {
    try {
        const user = jwt.decode(userToken);

        if (user.role !== 'client') {
            throw new Error(`${messageConstants.USER_NOT_AUTHORIZED}`);
        } else {
            payload.userId = user._id;

            if (payload.fileUrl) {
                payload.fileUrl = payload.fileUrl;
            } else {
                payload.fileUrl = null;
            }
            const jobData = new JobSchema(payload);
            const data = await jobData.save();
            return data;
        }
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error
    }
};

// ==== get all job post ==== service
const getAllJobPost = async () => {
    try {
        const jobSchema = await JobSchema.find();
        return jobSchema;
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error
    }
}

// ==== search job post ==== service
const searchJobPost = async (payload, userToken) => {
    const { searchQuery, budget, experience, sort } = payload;
    const user = jwt.decode(userToken);

    let baseQuery = {};

    // Regular filters based on user role (freelancer or client)
    if (user.role === 'freelancer') {
        if (budget) {
            baseQuery.budget = budget;
        }
        if (experience) {
            baseQuery.experience = experience;
        }
    } else if (user.role === 'client') {
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

// ==== get single job post ==== service
const getSingleJobPost = async (jobId) => {
    try {

        const jobSchema = await JobSchema.findById(jobId);
        return jobSchema;

    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return error
    }
}


// ==== get job post by user id ==== service
const getJobPostByUserId = async (userId, res) => {
    try {
        const jobSchema = await JobSchema.find({ userId: userId });
        logger.info(`${messageConstants.JOB_FETCHED_SUCCESSFULLY}`);
        return responseData.success(res, jobSchema, messageConstants.JOB_FETCHED_SUCCESSFULLY);
    } catch (error) {
        logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`);
        return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`, 500);
    }
}

// ==== update job post ==== service
const updateJobPost = async (body, res, userToken) => {
    return new Promise(async () => {
        const user = jwt.decode(userToken);

        if (user.role !== 'client') {
            logger.error(`${messageConstants.USER_NOT_AUTHORIZED}`);
            return responseData.fail(res, `${messageConstants.USER_NOT_AUTHORIZED}`, 401);
        } else {
            const jobSchema = new JobSchema(body);
            await jobSchema.save().then(result => {
                logger.info(`${messageConstants.JOB_UPDATED_SUCCESSFULLY}`);
                return responseData.success(res, result, messageConstants.JOB_UPDATED_SUCCESSFULLY);
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        }
    })
}

// ==== delete job post ==== service
const deleteJobPost = async (jobId, userToken) => {
    const user = jwt.decode(userToken);
    if (user.role !== 'client') {
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
    getSingleJobPost
};