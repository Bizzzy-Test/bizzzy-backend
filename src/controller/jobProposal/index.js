const jobProposalService = require('../../service/jobProposal');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { getFileUrl, getUserData } = require('../../middleware');

const createJobProposal = async (req, res) => {
	try {
		const userData = await getUserData(req, res);
		const taskFile = await getFileUrl(req);
		const response = await jobProposalService.createJobProposal(req, userData, taskFile, res);
		logger.info(`${messageConstants.RESPONSE_FROM} createJobProposal API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`createJobProposal ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};
// will be used by user to see his/her job proposals
const getAppliedJobPropasals = async (req, res) => {
	try {
		const userData = await getUserData(req, res);
		const response = await jobProposalService.getAppliedJobPropasals(userData, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getAppliedJobPropasals API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`getAppliedJobPropasals ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

const getJobProposalByUserId = async (req, res) => {
	try {
		const userData = await getUserData(req, res);
		const response = await jobProposalService.getJobProposalByUserId(req, userData, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByUserId API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`getJobProposalByUserId ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

// will be used by client to see job proposals on his job
const getJobProposalByJobId = async (req, res) => {
	try {
		const response = await jobProposalService.getJobProposalByJobId(req.params, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByJobId API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`getJobProposalByJobId ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

module.exports = {
	createJobProposal,
	getJobProposalByUserId,
	getJobProposalByJobId,
	getAppliedJobPropasals
};
