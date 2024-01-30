const { responseData } = require('../../constants');
const OfferSchema = require('../../models/offers');
const FreelancerSchemaProfileSchema = require('../../models/profile');
const JobProposalSchema = require('../../models/jobProposal');
const InvitationSchema = require('../../models/invite');
const { logger } = require('../../utils');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getReportData = async (req, userData, res) => {
    return new Promise(async () => {
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
        let query = {}
        if (userData?.role == 1) {
            query = {
                freelancer_id: userData._id
            }
        } else {
            query = {
                client_id: userData._id
            }
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
            stats: [
                {
                    title: "Application Sent",
                    number: application_sent,
                },
                {
                    title: "Invitations Received",
                    number: invitation_receive,
                },
                {
                    title: "Job Completed",
                    number: job_completed,
                },
                {
                    title: "Total Hours Worked",
                    number: total_worked_hours,
                },
                {
                    title: "Gross Earning",
                    number: gross_earnings,
                },
            ]
        };
        logger.info("Report Fetched succesfully");
        return responseData.success(res, result, "Report Fetched succesfully");
    })
}

const getAgencyData = async (req, userData, res) => {
    return new Promise(async () => {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        let agency_profile = ''
        let progress = 0;
        let review = 0;
        let pending = 0;
        let available = 0;
        let job_completed = 0;
        let total_worked_hours = 0;
        let gross_earnings = 0;
        let application_sent = 0;
        let invitation_receive = 0;
        await FreelancerSchemaProfileSchema.find({ user_id: userData._id }).then((result) => {
            agency_profile = result[0].agency_profile
        })
        console.log('ll', agency_profile)
        await JobProposalSchema.find(
            {
                userId: new ObjectId(agency_profile),
                created_at: { $gte: thirtyDaysAgo }
            }
        ).then(async (result) => {
            application_sent = result?.length
        })
        await InvitationSchema.find(
            {
                receiver_id: new ObjectId(agency_profile),
                created_at: { $gte: thirtyDaysAgo }
            }
        ).then(async (result) => {
            invitation_receive = result?.length
        })
        await OfferSchema.find(
            {
                ...query,
                created_at: { $gte: thirtyDaysAgo }
            }
        ).then((userReport) => {
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
            stats: [
                {
                    title: "Application Sent",
                    number: application_sent,
                },
                {
                    title: "Invitations Received",
                    number: invitation_receive,
                },
                {
                    title: "Job Completed",
                    number: job_completed,
                },
                {
                    title: "Total Hours Worked",
                    number: total_worked_hours,
                },
                {
                    title: "Gross Earning",
                    number: gross_earnings,
                },
            ]
        };
        logger.info("Report Fetched succesfully");
        return responseData.success(res, result, "Report Fetched succesfully");
    })
}
module.exports = {
    getReportData,
    getAgencyData
}