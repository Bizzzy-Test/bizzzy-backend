const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const experienceSchema = mongoose.Schema({
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
    years_experience: {
        type: Number
    },
    start_date:{
        type: String
    },
    end_date: {
        type: String
    }
}, { _id: false });

const educationSchema = mongoose.Schema({
    degree_name: {
        type: String
    },
    institution: {
        type: String
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String
    }
}, { _id: false });

const portfolioSchema = mongoose.Schema({
    headline: {
        type: String
    },
    description: {
        type: String
    },
    attachements: {
        type: String
    }
}, { _id: false });

const skillSchema = mongoose.Schema({
    skill_name: {
        type: String
    }
}, { _id: false });

const profileSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    professional_role: {
        type: String,
        default: 'null'
    },
    profile_image: {
        type: String,
        default: 'null'
    },
    title: {
        type: String,
        default: 'null'
    },
    hourly_rate: {
        type: String,
        default: 'null'
    },
    description: {
        type: String,
        default: 'null'
    },
    experience: {
        type: [experienceSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    },
    portfolio: {
        type: [portfolioSchema],
        default: []
    },
    skills: {
        type: [skillSchema],
        default: []
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
    }
})

module.exports = mongoose.model('freelencer_profile', profileSchema)
