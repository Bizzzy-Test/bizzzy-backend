const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');
const { jobTypes } = require('../constants/enum');

const jobProposalSchema = mongoose.Schema(
	{
		jobId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Job'
		},
		userId: {
			// user_id of the client who is applying for the job
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		desiredPrice: {
			// amount given by the user (how much they want to be paid)
			type: Number,
			required: true,
			min: 0
		},
		jobType: {
			// desired payment method of user
			type: String,
			required: true,
			enum: Object.values(jobTypes)
		},
		coverLetter: {
			type: String,
			required: true
		},
		projectFilesLink: {
			type: [String],
			required: false
		},
		created_at: {
			type: Date,
			default: Date.now
		},
		file: {
			type: String
		},
		created_at: {
			type: Date,
			required: true,
			default: Date.now
		},
		updated_at: {
			type: Date,
			required: true,
			default: Date.now
		},
		is_deleted: {
			type: Boolean,
			default: false
		},
		status: {
			type: Number,
			required: true,
			default: 1
		}
	}
);

module.exports = mongoose.model('job_proposal', jobProposalSchema);
