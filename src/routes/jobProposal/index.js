const jobProposalAPI = require("../../controller/jobProposal");
const { urlConstants } = require("../../constants");

module.exports = (app) => {
    app.post(urlConstants.CREATE_JOB_PROPOSAL, jobProposalAPI.createJobProposal);
    app.get(urlConstants.GET_JOB_PROPOSALS_BY_JOB_ID, jobProposalAPI.getJobProposalByJobId);
    app.get(urlConstants.GET_JOB_PROPOSALS_BY_USER_ID, jobProposalAPI.getJobProposalByUserId);
}