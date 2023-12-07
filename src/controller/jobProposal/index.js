const jobProposalService = require('../../service/jobProposal');
const { messageConstants } = require('../../constants');
const { logger } = require('../../utils');
const { uploadFile } = require('../../middleware/aws/aws');
const JobProposalSchema = require('../../models/jobProposal');

const createJobProposal = async (req, res) => {
	try {
		const userID = req.userId;
		const jobId = req.body.jobId;
		const { desiredPrice, jobType, coverLetter } = req.body; // Destructure properties from req.body
		let fileUrl = '';

		// Check if the user has already applied for the proposal
		const userAlreadyApplied = await JobProposalSchema.findOne({
			$and: [ { userId: userID }, { jobId: jobId } ]
		});

		if (userAlreadyApplied) {
			return res.send({ code: 400, message: 'You have already applied for this proposal.' });
		}

		if (req.file) {
			const fileBuffer = req.file.buffer;
			const folderName = 'job_files';
			// Upload the file buffer to S3 and get its access URL
			fileUrl = await uploadFile(fileBuffer, req.file.originalname, req.file.mimetype, folderName);
		}

		// Continue with the creation of the job proposal
		const newJobProposal = new JobProposalSchema({
			userId: userID,
			jobId: jobId,
			file: fileUrl || null,
			desiredPrice: desiredPrice,
			jobType: jobType,
			coverLetter: coverLetter
		});

		await newJobProposal.save();

		logger.info(`${messageConstants.RESPONSE_FROM} createJobProposal API`, JSON.stringify(newJobProposal));
		return res.send({ code: 200, newJobProposal });
	} catch (err) {
		res.send(err);
	}
};

// will be used by user to see his/her job proposals
const getJobProposalByUsersId = async (req, res) => {
	try {
		const userToken = req.headers.token;
		const response = await jobProposalService.getJobProposalByUsersId(userToken, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByUserId API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`getJobProposalByUserId ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

const getJobProposalByUserId = async (req, res) => {
	try {
		const userToken = req.headers.token;
		const response = await jobProposalService.getJobProposalByUserId(userToken, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByUserId API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`getJobProposalByUserId ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

// will be used by client to see job proposals on his job
const getJobProposalByJobId = async (req, res) => {
	try {
		const response = await jobProposalService.getJobProposalByJobId(req.params, res);
		logger.info(`${messageConstants.RESPONSE_FROM} getJobProposalByJobId API`, JSON.stringify(response));
		res.send(response);
	} catch (err) {
		logger.error(`herrrrrrrrreeeeeee`);
		logger.error(`getJobProposalByJobId ${messageConstants.API_FAILED} ${err}`);
		res.send(err);
	}
};

module.exports = {
	createJobProposal,
	getJobProposalByUserId,
	getJobProposalByJobId,
	getJobProposalByUsersId
};
