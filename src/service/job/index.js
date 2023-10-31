const { responseData, messageConstants } = require("../../constants");
const JobSchema = require("../../models/job")
const { logger } = require("../../utils");
const jwt = require('jsonwebtoken');
// const e = require("cors");
// const uploadMiddleware = require('../../middleware/uploadMiddleware/index.js');

// ==== create job post ==== service
// const createJobPost = async (body, res, userToken) => {
//     return new Promise(async () => {
//         const user = jwt.decode(userToken);

//         if (user.role !== 'client') {
//             logger.error(`${messageConstants.USER_NOT_AUTHORIZED}`);
//             return responseData.fail(res, `${messageConstants.USER_NOT_AUTHORIZED}`, 401);
//         } else {
//             const jobSchema = new JobSchema(body);
//             await jobSchema.save().then(result => {
//                 logger.info(`${messageConstants.JOB_CREATED_SUCCESSFULLY}`);
//                 return responseData.success(res, result, messageConstants.JOB_CREATED_SUCCESSFULLY);
//             }).catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             })
//         }
//     })
// }


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
    deleteJobPost
};