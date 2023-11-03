const jobProposalAPI = require("../../controller/jobProposal");
const { jsonWebToken } = require("../../middleware");
const { urlConstants } = require("../../constants");

module.exports = (app) => {
    app.post(urlConstants.CREATE_JOB_PROPOSAL, jsonWebToken.validateToken, jobProposalAPI.createJobProposal);
    app.get(urlConstants.GET_JOB_PROPOSALS_BY_JOB_ID, jsonWebToken.validateToken, jobProposalAPI.getJobProposalByJobId);
    app.get(urlConstants.GET_JOB_PROPOSALS_BY_USER_ID, jsonWebToken.validateToken, jobProposalAPI.getJobProposalByUserId);
}