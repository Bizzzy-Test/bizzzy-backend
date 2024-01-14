const { messageConstants } = require("../../constants");
const responseData = require("../../constants/responses");
const GigSchema = require("../../models/gig")
const { logger } = require("../../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// ==== create job post ==== service
const createGig = async (req, userData, res) => {
    return new Promise(async () => {
        req.body['freelancer_id'] = userData._id
        if (userData.role == 1) {
            const gigSchema = new GigSchema(req.body);
            await gigSchema.save().then(async (result) => {
                logger.info('Gig created successfully');
                return responseData.success(res, result, 'Gig created successfully');
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error('Only freelancer can create new gig');
            return responseData.fail(res, 'Only freelancer can create new gig', 401);
        }
    })
};

module.exports = {
    createGig
};