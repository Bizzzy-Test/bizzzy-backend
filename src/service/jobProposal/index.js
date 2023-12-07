const { responseData, messageConstants } = require('../../constants');
const JobProposalSchema = require('../../models/jobProposal');
const { logger } = require('../../utils');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createJobProposal = async (payload, userToken, res) => {
	return new Promise(async () => {
		const userData = jwt.decode(userToken);
		payload.userId = userData.id;
		const jobProposal = JobProposalSchema(payload);
		await jobProposal
			.save()
			.then((response) => {
				responseData.success(res, response, `job proposal created succesfully`);
			})
			.catch((err) => {
				logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
				return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
			});
	});
};

const getJobProposalByUsersId = async (userToken, res) => {
	return new Promise(async () => {
        const user = jwt.decode(userToken);
        const userId = user?.id;

		await JobProposalSchema.find({ userId: userId }).populate('jobId')
			.then(async (result) => {
				return responseData.success(res, result, `job proposal fetched succesfully`);
			})
			.catch((err) => { 
				logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
				return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
			});
	});
};

// const getJobProposalByUsersId = async (userToken, res) => {
//     return new Promise(async () => {
//         const user = jwt.decode(userToken);
//         const userId = user?.id;

//         await JobProposalSchema.find({ userId: userId })
//             .populate('jobId')  
//             .then(async (result) => {
//                 return responseData.success(res, result, `job proposal fetched successfully`);
//             })
//             .catch((err) => {
//                 logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
//                 return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
//             });
//     });
// };



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
				$match: { jobId: new ObjectId(req.jobId) }
			},
			{
				$lookup: {
					from: 'freelencer_profiles',
					localField: 'userId',
					foreignField: 'user_id',
					pipeline: [
						{
							$project: {
								_id: 0,
								user_id: 1,
								firstName: 1,
								lastName: 1,
								location: 1,
								professional_role: 1,
								profile_image: 1,
								skills: 1
							}
						}
					],
					as: 'user_details'
				}
			}
		];
		await JobProposalSchema.aggregate(query)
			.then(async (result) => {
				return responseData.success(res, result, `job proposal fetched succesfully`);
			})
			.catch((err) => {
				logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
				return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
			});
	});
};

module.exports = {
	createJobProposal,
	getJobProposalByUserId,
	getJobProposalByJobId,
    getJobProposalByUsersId
};
