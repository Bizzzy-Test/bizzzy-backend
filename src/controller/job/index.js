const JobService = require("../../service/job/index.js");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { uploadFile, deleteFile } = require("../../middleware/aws/aws.js");
const { getUserData, getFileUrl } = require("../../middleware/index.js");

// ==== create job post ==== controller

const createJobPost = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const taskFile = await getFileUrl(req.file, 'images');
        const response = await JobService.createJobPost(req, userData, taskFile, res);
        logger.info(`${messageConstants.RESPONSE_FROM} createJobPost API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createJobPost ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};

const closeJob = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await JobService.closeJob(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} closeJob API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`closeJob ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
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

const searchJobPosts = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const searchQuery = req.query.query;
        const response = await JobService.searchJobPost({
            searchQuery,
            budget: req.query.budget,
            experience: req.query.experience,
            sort: req.query.sort,
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

const searchJobPost = async (req, res) => {
    try {
        // const userData = await getUserData(req, res);
        const response = await JobService.searchJobPost(req, res);
        if (response != null) {
            res.sendFile(response);
        }
    } catch (err) {
        logger.error(`Update experience ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

// ==== get job post by userId ==== controller

const getJobPostByUserId = async (req, res) => {
    try {
        // const client_details = req.params.id;
        const userData = await getUserData(req, res)
        const response = await JobService.getJobPostByUserId(req, userData, res);

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
        })
    }

}

// ==== get single job post ==== controller
const getSingleJobPost = async (req, res) => {
    try {
        const response = await JobService.getSingleJobPost(req, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getSingleJobPost API`, JSON.stringify(response));
        res.send(response);
    } catch (error) {
        logger.error(`getSingleJobPost ${messageConstants.API_FAILED} ${error}`);
        res.send(error);
    }

}


// ==== update job post ==== controller
const updateJobPost = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const fileUrl = await getFileUrl(req.file, 'images');
        const response = await JobService.updateJobPost(req, userData, fileUrl, res);
        logger.info(`${messageConstants.RESPONSE_FROM} updateJobPost API`, JSON.stringify(response));
        res.send(response);
    } catch (error) {
        logger.error(`updateJobPost ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
};


// ==== delete job post ==== controller
const deleteJobPost = async (req, res) => {
    try {
        const userData = await getUserData(req, res);
        const response = await JobService.deleteJobPost(req, userData, res);
        logger.info(`${messageConstants.RESPONSE_FROM} deleteJobPost API`, JSON.stringify(response));
        res.send(response);
    } catch (error) {
        logger.error(`deleteJobPost ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
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
    closeJob
};