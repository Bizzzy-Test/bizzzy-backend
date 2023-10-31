const api = require("../../controller/job");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const { uploadStoreg } = require("../../middleware/multer/multer");

module.exports = (app) => {
    app.post(urlConstants.ADD_JOB, jsonWebToken.validateToken, uploadStoreg.single("file"), api.createJobPost);
    app.get(urlConstants.GET_JOB, api.getAllJobPost);
    app.get(urlConstants.GET_JOB_BY_USERID, api.getJobPostByUserId);
    app.patch(urlConstants.UPDATE_JOB, jsonWebToken.validateToken, api.updateJobPost);
    app.delete(urlConstants.DELETE_JOB, jsonWebToken.validateToken, api.deleteJobPost);
}