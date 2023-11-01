const api = require("../../controller/job");
const { urlConstants } = require("../../constants");
const { jsonWebToken } = require("../../middleware");
const { upload } = require("../../middleware/multer/multer");

module.exports = (app) => {
    app.post(urlConstants.ADD_JOB, jsonWebToken.validateToken, upload.single("file"), api.createJobPost);
    app.get(urlConstants.GET_JOB, jsonWebToken.validateToken, api.getAllJobPost);
    app.get(urlConstants.GET_JOB_BY_USERID, jsonWebToken.validateToken, api.getJobPostByUserId);
    app.patch(urlConstants.UPDATE_JOB, jsonWebToken.validateToken, upload.single("file"), api.updateJobPost);
    app.delete(urlConstants.DELETE_JOB, jsonWebToken.validateToken, api.deleteJobPost);
    app.get(urlConstants.GET_SINGEL_JOB, jsonWebToken.validateToken, api.getSingleJobPost);
    app.get(urlConstants.JOB_SEARCH, jsonWebToken.validateToken, api.searchJobPost);
}