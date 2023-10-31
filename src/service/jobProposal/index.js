const { responseData, messageConstants } = require('../../constants');
const JobProposalSchema = require('../../models/jobProposal');
const { logger } = require('../../utils');

const createJobProposal  = async (req, res) => {
    return new Promise(async () => {
        const jobProposal = JobProposalSchema(req);
        await jobProposal.save().then(response => {
            responseData.success(res, response, `job proposal created succesfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getJobProposalByUserId = async (req, res) => {
    return new Promise(async () => {
        await JobProposalSchema.find({userId: req.userId}).then(async (result) => {
            return responseData.success(res, result, `job proposal fetched succesfully`);
            
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

const getJobProposalByJobId = async (req, res) => {
    return new Promise(async () => {
        await JobProposalSchema.find({jobId: req.jobId}).then(async (result) => {
            return responseData.success(res, result, `job proposal fetched succesfully`);
            
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

module.exports = {
    createJobProposal,
    getJobProposalByUserId,
    getJobProposalByJobId
}