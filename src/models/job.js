const uuid = require('uuid');
const mongoose = require('mongoose');
const { budgetType, experienceType } = require('../constants/enum');

const JobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    client_detail: {
        type: String,
        required: true,
        ref: 'users'
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
    ]
});

module.exports = mongoose.model('Job', JobSchema);
