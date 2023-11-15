const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');
const { jobTypes } = require('../constants/enum');

const jobProposalSchema = mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {  // user_id of the client who is applying for the job
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    desiredPrice: { // amount given by the user (how much they want to be paid)
        type: Number,
        required: true,
        min: 0
    },
    jobType: { // desired payment method of user
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
    file:{
        type: String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('job_proposal', jobProposalSchema)