const JobService = require("../../service/job/index.js");
const { messageConstants } = require('../../constants/index.js');
const { logger } = require('../../utils/index.js');
const { uploadFile, deleteFile } = require("../../middleware/aws/aws.js");
const { getUserData } = require("../../middleware/index.js");

// ==== create job post ==== controller

const createJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        console.log(userToken);
        const jobData = req.body;

        let fileUrl = "";

        if (req.file) {
            const fileBuffer = req.file.buffer;
            const folderName = "job_files";
            // Upload the file buffer to S3 and get its access URL
            fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folderName);
        }
        // Add the file URL to the jobData object
        jobData.file = fileUrl === "" ? "null" : fileUrl;

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
        const userData = await getUserData(req, res);
        const response = await JobService.searchJobPost(req, userData, res);
        if (response != null){
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
        // const client_detail = req.params.id;
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
        const jobId = req.params.id;
        const response = await JobService.getSingleJobPost(jobId);
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


// ==== update job post ==== controller
const updateJobPost = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const jobId = req.params.id;
        const jobData = req.body;
        const folderName = "job-files";

        // Check if a new file was uploaded in the request
        if (req.file) {
            const fileBuffer = req.file.buffer;
            // Upload the new file buffer to S3 and get its access URL
            const fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folderName);
            // Add the new file URL to the jobData object
            jobData.file = fileUrl;

            // Delete the old file from S3
            const existingJob = await JobService.getSingleJobPost(jobId);
            const existingFileKey = existingJob.fileUrl.split('/').pop();
            await deleteFile(existingFileKey);


        } else {
            // If no new file was uploaded, keep the existing file URL in jobData
            const existingJob = await JobService.getSingleJobPost(jobId);
            jobData.file = existingJob.file;
        }

        const response = await JobService.updateJobPost(jobData, jobId, userToken);
        res.status(200).json({
            data: response,
            success: true,
            message: messageConstants.JOB_UPDATED_SUCCESSFULLY,
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


module.exports = {
    createJobPost,
    getAllJobPost,
    getJobPostByUserId,
    updateJobPost,
    deleteJobPost,
    searchJobPost,
    getSingleJobPost
};