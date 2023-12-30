const { responseData, messageConstants } = require("../../constants");
const { logger } = require("../../utils");
const JobSchema = require("../../models/job")

const getJobForDashboard = async (req, res) => {
    return new Promise(async () => {
        const role = req?.query?.role;
        const start_date = req?.query?.start_date;
        const end_date = new Date(req?.query?.end_date);
        const query = [
            {
                $match: {}
            },
            {
                $lookup: {
                    from: 'client_profiles',
                    let: { clientId: { $toObjectId: '$client_id' } }, 
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$user_id', '$$clientId'] 
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                user_id: 1,
                                firstName: 1,
                                lastName: 1,
                                location: 1,
                                profile_image: 1,
                                businessName: 1
                            }
                        }
                    ],
                    as: 'client_profile'
                }
            },
        ];
        if (role == 3) {
            if (start_date && end_date) {
                query[0].$match.created_at = {
                    $gte: new Date(start_date),
                    $lt: new Date(end_date.getTime() + 24 * 60 * 60 * 1000) 
                };
            }
            await JobSchema.aggregate(query).then(async (result) => {
                logger.info('JOb list fetched succesfully for dashboard');
                return responseData.success(res, result, `JOb list fetched succesfully for dashboard`);
            }).catch((err) => {
                logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
                return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
            })
        } else {
            logger.error("Unauthorized!! only admin can access this data.");
            return responseData.fail(res, "Unauthorized!! only admin can access this data.", 401);
        }
    })
}

module.exports = {
    getJobForDashboard
}