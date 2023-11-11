const jobProposalService = require('../../service/jobProposal');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { uploadFile } = require('../../middleware/aws/aws');

const createJobProposal = async (req, res) => {
    try {
        const userToken = req.headers.token;
        const jobProposalData = req.body;
        let fileUrl = "";

        if (req.file) {
            const fileBuffer = req.file.buffer;
            const folderName = "job_files";
            // Upload the file buffer to S3 and get its access URL
            fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folderName);
        }
        // Add the file URL to the jobData object
        jobProposalData.file = fileUrl || null; // Use null instead of "null" if no file URL
        const response = await jobProposalService.createJobProposal(jobProposalData, userToken, res);
        logger.info(`${messageConstants.RESPONSE_FROM} createJobProposal API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`createJobProposal ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

// will be used by user to see his/her job proposals
const getJobProposalByUserId = async (req, res) => {
    try {
        const response = await jobProposalService.getJobProposalByUserId(req.params, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByUserId API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`getJobProposalByUserId ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}

// will be used by client to see job proposals on his job
const getJobProposalByJobId = async (req, res) => {
    try {
        const response = await jobProposalService.getJobProposalByJobId(req.params, res);
        logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByJobId API`, JSON.stringify(response));
        res.send(response);
    } catch (err) {
        logger.error(`herrrrrrrrreeeeeee`);
        logger.error(`getJobProposalByJobId ${messageConstants.API_FAILED} ${err}`);
        res.send(err);
    }
}


module.exports = {
    createJobProposal,
    getJobProposalByUserId,
    getJobProposalByJobId
}