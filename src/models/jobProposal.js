const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const jobProposalSchema = mongoose.Schema({

    jobId: {
        type: String,
        required: true,
    },
    userId: {  // user_id of the client who is applying for the job
        type: String,
        required: true,
    },
    desiredPrice: { // amount given by the user (how much they want to be paid)
        type: Number,
        required: true,
        min: 0
    },
    PaymentPreference: { // desired payment method of user
        type: String,
        required: true,
        enum: [
            'project',
            'milestone',
            'hourly',
        ]
    },
    coverLetter: {
        type: String,
        required: true
    },
    projectFilesLink: {
        type: [String],
        required: false
    }
})

module.exports = mongoose.model('job_proposal', jobProposalSchema)