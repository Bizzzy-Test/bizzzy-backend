const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const experienceSchema = mongoose.Schema({
    position: {
        type: String,
        required: true,
    },

    company_name: {
        type: String,
        required: true,
    },

    job_description: {
        type: String,
        required: true,
    },
    job_location: {
        type: String,
        required: true,
    },

    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    }
});

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
});

const portfolioSchema = mongoose.Schema({
    project_name: {
        type: String
    },
    project_description: {
        type: String
    },
    technologies: {
        type: Array
    },
    // Max images three
    attachements: {
        type: Array
    }
});

const profileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
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
        type: Number,
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
        type: Array,
        default: []
    },
    categories: {
        type: Array,
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
