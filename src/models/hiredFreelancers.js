const mongoose = require('mongoose');

const HiredFreelancersSchema = mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freelancer_profiles',
        required: true,
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client_profiles',
        required: true,
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobs',
        required: true,
    },
    job_type: {
        type: String
    },
    status: {
        type: String,
        default:'accepted'
    },
    budget: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('hired_freelancers', HiredFreelancersSchema);
