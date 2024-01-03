const jobProposalAPI = require('../../controller/jobProposal');
const { jobProposalValidator, jsonWebToken } = require('../../middleware');
const { urlConstants } = require('../../constants');
const upload = require('../../middleware/image_upload');

module.exports = (app) => {
	app.post(urlConstants.CREATE_JOB_PROPOSAL, jsonWebToken.validateToken, upload.single('file'), jobProposalValidator.jobProposalCreateValidation, jobProposalAPI.createJobProposal);
	app.get(urlConstants.GET_JOB_PROPOSALS_BY_JOB_ID, jsonWebToken.validateToken, jobProposalAPI.getJobProposalByJobId);
	app.get(urlConstants.GET_JOB_PROPOSALS_BY_USER_ID, jsonWebToken.validateToken, jobProposalAPI.getJobProposalByUserId);
	app.get(urlConstants.GET_JOB_PROPOSALS, jsonWebToken.validateToken, jobProposalAPI.getAppliedJobPropasals);
};
