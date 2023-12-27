const { responseData } = require('../../constants');
const OfferSchema = require('../../models/offers');
const JobProposalSchema = require('../../models/jobProposal');
const InvitationSchema = require('../../models/invite');
const { logger } = require('../../utils');

const getReportData = async (req, userData, res) => {
    return new Promise(async () => {
        if (userData.role == 1) {
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            let progress = 0;
            let review = 0;
            let pending = 0;
            let available = 0;
            let job_completed = 0;
            let total_worked_hours = 0;
            let gross_earnings = 0;
            let application_sent = 0;
            let invitation_receive = 0;
            let query = {
                freelencer_id: userData._id
            }
            await JobProposalSchema.find(
                {
                    userId: userData._id,
                    created_at: { $gte: thirtyDaysAgo }
                }).then(async (result) => {
                    application_sent = result?.length
                })
            await InvitationSchema.find(
                {
                    receiver_id: userData._id,
                    created_at: { $gte: thirtyDaysAgo }
                }).then(async (result) => {
                    invitation_receive = result?.length
                })
            await OfferSchema.find(
                {
                    ...query,
                    created_at: { $gte: thirtyDaysAgo }
                }).then((userReport) => {
                    userReport.forEach(offer => {
                        progress += offer.budget || 0;
                        if (offer?.status === 'completed') {
                            job_completed++
                        }
                    });
                })
            const result = {
                user_details: {
                    _id: userData._id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role,
                    country: userData.country
                },
                balance: {
                    progress,
                    review,
                    pending,
                    available
                },
                stats: {
                    application_sent,
                    invitation_receive,
                    job_completed,
                    total_worked_hours,
                    gross_earnings
                }
            };
            logger.info("Report Fetched succesfully");
            return responseData.success(res, result, "Report Fetched succesfully");
        } else {
            logger.error('This report is only for freelancers not for clients');
            return responseData.fail(res, 'This report is only for freelancers not for clients', 403);
        }
    })
}

module.exports = {
    getReportData
}