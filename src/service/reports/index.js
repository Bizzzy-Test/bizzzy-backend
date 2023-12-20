const { responseData } = require('../../constants');
const OfferSchema = require('../../models/offers');
const { logger } = require('../../utils');

const getReportData = async (req, userData, res) => {
    return new Promise(async () => {
        let progress = 0;
        let review = 0;
        let pending = 0;
        let available = 0;
        let query = {}
        if (userData?.role == 1) {
            query = {
                freelencer_id: userData._id
            }
        } else {
            query = {
                client_id: userData._id
            }
        }
        await OfferSchema.find(query).then((userReport) => {
            userReport.forEach(offer => {
                progress += offer.budget || 0;
            });
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
                }
            };
            logger.info("Report Fetched succesfully");
            return responseData.success(res, result, "Report Fetched succesfully");
        })
    })
}

module.exports = {
    getReportData
}