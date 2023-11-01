const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const profileSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        enum: [
            userType.FREELANCER,
            userType.CLIENT
        ],
    },
    company_name: {
        type: String
    },
    industry: [
        {
            type: String
        }
    ],
    location: {
        type: String
    },
    company_stage: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    position: {
        type: String,
    },
    seeking_help: [{
        type: String
    }],
    provide_help: [{
        type: String
    }],
    bio: {
        type: String
    },
    profile_image: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        default: 1,
    },
    rate: {
        type: String,
        default: 1,
    },

})

module.exports = mongoose.model('user_profile', profileSchema)