const { responseData, messageConstants } = require('../../constants');
const JobProposalSchema = require('../../models/jobProposal');
const { logger } = require('../../utils');
const jwt = require('jsonwebtoken');

const createJobProposal = async (payload, userToken, res) => {
    return new Promise(async () => {
        const userData = jwt.decode(userToken);
        payload.userId = userData.id;
        const jobProposal = JobProposalSchema(payload);
        await jobProposal.save().then(response => {
            responseData.success(res, response, `job proposal created succesfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}



const getJobProposalByUserId = async (req, res) => {
    return new Promise(async () => {
        await JobProposalSchema.find({ userId: req.userId }).then(async (result) => {
            return responseData.success(res, result, `job proposal fetched succesfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}


const getJobProposalByJobId = async (req, res) => {
    return new Promise(async () => {
        const query = [
            {
                $match: { jobId: req.jobId }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: { $toObjectId: '$userId' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                country: 1
                            }
                        }
                    ],
                    as: 'user_details'
                }
            }
        ];
        await JobProposalSchema.aggregate(query).then(async (result) => {
            return responseData.success(res, result, `job proposal fetched succesfully`);
        }).catch((err) => {
            logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
            return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
        })
    })
}

module.exports = {
    createJobProposal,
    getJobProposalByUserId,
    getJobProposalByJobId,
}