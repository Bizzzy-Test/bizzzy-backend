const { responseData, messageConstants } = require('../../constants');
const JobProposalSchema = require('../../models/jobProposal');
const { logger } = require('../../utils');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createJobProposal = async (req, userData, taskFile, res) => {
	return new Promise(async () => {
		req.body['userId'] = userData._id
		req.body['file'] = taskFile
		await JobProposalSchema.find({
			userId: new ObjectId(userData._id),
			jobId: new ObjectId(req.body.jobId)
		}).then(async (result) => {
			if (result?.length !== 0) {
				logger.error('You have already applied for this proposal.');
				return responseData.fail(res, 'You have already applied for this proposal.', 400);
			} else {
				const jobProposalSchema = new JobProposalSchema(req.body);
				await jobProposalSchema.save().then(async (result) => {
					logger.info('job proposal submitted successfully');
					return responseData.success(res, result, 'job proposal submitted successfully');
				}).catch((err) => {
					logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
					return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
				})
			}
		})

	})
}

const getAppliedJobPropasals = async (userData, res) => {
	return new Promise(async () => {
		await JobProposalSchema.find({ userId: userData._id }).populate('jobId')
			.then(async (result) => {
				return responseData.success(res, result, `job proposal fetched succesfully`);
			})
			.catch((err) => {
				logger.error(`${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`);
				return responseData.fail(res, `${messageConstants.INTERNAL_SERVER_ERROR}. ${err}`, 500);
			});
	});
};

// const getAppliedJobPropasals = async (userData, res) => {
// 	return new Promise(async () => {
// 	  try {
// 		const jobProposals = await JobProposalSchema.find({ userId: userData._id }).populate('jobId');
  
// 		// Modify the response to send job details instead of just the jobId
// 		const jobDetails = jobProposals.map((proposal) => proposal.jobId);
  
// 		return responseData.success(res, jobDetails, 'Job proposals fetched successfully');
// 	  } catch (error) {
// 		const errorMessage = `${messageConstants.INTERNAL_SERVER_ERROR}. ${error}`;
// 		logger.error(errorMessage);
// 		return responseData.fail(res, errorMessage, 500);
// 	  }
// 	});
//   };
  

// const getAppliedJobPropasals = async (userToken, res) => {
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
	getAppliedJobPropasals
};
