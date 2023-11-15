
const { messageConstants, responseData, mailTemplateConstants } = require('../../constants');
const InviteSchema = require('../../models/invite');
const UserSchema = require('../../models/users');
const OfferSchema = require('../../models/offers');
const { logger, mail } = require('../../utils');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Send user invite
const sendOffer = async (body, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 2) {
            body.freelencer_id=new ObjectId(body.freelencer_id);
            body.client_id=userData._id;
            const offerSchema = new OfferSchema({ ...body });
            await offerSchema.save().then(async (result) => {
                logger.info(messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
                return responseData.success(res, result, messageConstants.JOB_OFFER_SEND_SUCCESSFULLY);
            }).catch((err) => {
                    logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                    return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.info(messageConstants.NOT_SENT_OFFER);
            return responseData.fail(res, `${messageConstants.NOT_SENT_OFFER}`, 401);
        }
    })
}

module.exports = {
    sendOffer
}