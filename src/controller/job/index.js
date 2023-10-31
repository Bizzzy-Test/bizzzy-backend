const JobService = require("../../service/job/index.js");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { uploadFile } = require("../../middleware/aws/aws.js");

// ==== create job post ==== controller
const createJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const file = req.file.buffer;
        const jobData = req.body;

        // Upload the file to S3 and get its access URL
        const fileUrl = await uploadFile(file);

        // Add the file URL to the jobData object
        jobData.fileUrl = fileUrl;

        console.log("jobData:", jobData);

        console.log("fileUrl:", fileUrl);

        console.log("file:", file);

        const response = await JobService.createJobPost(jobData, userToken);
        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_CREATED_SUCCESSFULLY,
        });
    } catch (error) {
        console.error("Error creating job post:", error);
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

// ===== search job post ==== controller

const searchJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const searchQuery = req.query.query; // Get the search query from the URL query parameter
        const response = await JobService.searchJobPost({
            searchQuery,
            budget: req.query.budget, // Example: Extract budget parameter
            experience: req.query.experience, // Example: Extract experience parameter
            sort: req.query.sort, // Example: Extract sort parameter
        }, userToken);
        logger.info(`${messageConstants.RESPONSE_FROM} Job API`, JSON.stringify(response));
        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_FETCHED_SUCCESSFULLY
        });
    } catch (error) {
        logger.error(`Job ${messageConstants.API_FAILED} ${error}`);
        res.status(500).json({
            data: error,
            success: false,
            message: messageConstants.INTERNAL_SERVER_ERROR
        });
    }
};


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

// ==== get single job post ==== controller
const getSingleJobPost = async (req, res) => {
    try {
        const jobId = req.params.id;
        const response = await JobService.getSingleJobPost(jobId, res);
       
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
    deleteJobPost,
    searchJobPost,
    getSingleJobPost
};