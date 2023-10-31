const JobService = require("../../service/job/index.js");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');

// ==== create job post ==== controller
// const createJobPost = async (req, res) => {
//     try {
//         const userToken = req.headers.token;

//         const response = await JobService.createJobPost(req.body, userToken);

//         res.status(200).json({
//             data: response,
//             success: true,
//             message: messageConstants.JOB_CREATED_SUCCESSFULLY
//         })
//     } catch (error) {
//         logger.error(`Job ${messageConstants.API_FAILED} ${err}`);
//         res.status(500).json({
//             data: error,
//             success: false,
//             message: messageConstants.INTERNAL_SERVER_ERROR
//         })
//     }
// }

const createJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;

        const response = await JobService.createJobPost( userToken);
        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_CREATED_SUCCESSFULLY,
        });
    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.status(500).json({
            data: error,
            success: false,
            message: messageConstants.INTERNAL_SERVER_ERROR,
        });
    }
};

// ==== get all job post ==== controller
const getAllJobPost = async (req, res) => {
    try {
        const response = await JobService.getAllJobPost();
        logger.info(`${messageConstants.RESPONSE_FROM} Job API`, JSON.stringify(response));
        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_FETCHED_SUCCESSFULLY
        }); // Send the response here    

    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.status(500).json({
            data: error,
            success: false,
            message: messageConstants.INTERNAL_SERVER_ERROR
        })
    }
}


// ==== get job post by userId ==== controller

const getJobPostByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await JobService.getJobPostByUserId(userId, res);
        logger.info(`${messageConstants.RESPONSE_FROM} Job API`, JSON.stringify(response));
        res.send(response);
    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.send(error);
    }

}


// ==== update job post ==== controller

const updateJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const response = await JobService.updateJobPost(req.body, res, userToken);
        logger.info(`${messageConstants.RESPONSE_FROM} Job API`, JSON.stringify(response));
        res.send(response);
    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.send(error);
    }

}

// ==== delete job post ==== controller

const deleteJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const jobId = req.params.id;
        const response = await JobService.deleteJobPost(jobId, userToken);
        logger.info(`${messageConstants.RESPONSE_FROM} Job API`, JSON.stringify(response));

        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_DELETED_SUCCESSFULLY
        }); // Send the response here

    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.status(500).json({
            data: error,
            success: false,
            message: messageConstants.INTERNAL_SERVER_ERROR
        })
    }
}


module.exports = {
    createJobPost,
    getAllJobPost,
    getJobPostByUserId,
    updateJobPost,
    deleteJobPost
};