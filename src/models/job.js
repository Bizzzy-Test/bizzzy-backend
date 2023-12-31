const mongoose = require('mongoose');
const { budgetType, experienceType } = require('../constants/enum');

const JobSchema = mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    budget: {
        type: String,
        enum: [
            budgetType.FIXED_BUDGET,
            budgetType.HOURLY
        ],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'open'
    },
    file: {
        type: String
    },
    experience: {
        type: String,
        enum: [
            experienceType.ENTRY,
            experienceType.INTERMEDIATE,
            experienceType.EXPERT
        ],
        required: true
    },
    durations: {
        type: String
    },
    skills: [
        {
            type: String
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Job', JobSchema);
