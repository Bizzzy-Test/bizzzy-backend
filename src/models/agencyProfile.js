const mongoose = require('mongoose');

const agencyPortfolioSchema = mongoose.Schema({
    project_name: {
        type: String,
        required: true,
    },
    project_description: {
        type: String,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
    },
    project_images: {
        type: [String],
        required: true,
    },
});
const agencyOfficeLocationSchema = mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});
const agencyCompanyInfoSchema = mongoose.Schema({
    agency_size: {
        type: String,
        required: true,
    },
    agency_foundedYear: {
        type: String,
        required: true,
    },
    agency_focus: {
        type: [String],
        required: true,
    },
    agency_language: {
        type: String,
        required: true,
    },
});
const agencyProfileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    agency_name: {
        type: String,
        required: true
    },
    agency_tag: {
        type: String,
        required: true
    },
    agency_overview: {
        type: String,
        required: true,
    },
    agency_profileImage: {
        type: String,
        default: null
    },
    agency_coverImage: {
        type: String,
        default: null
    },
    agency_hourlyRate: {
        type: Number,
        default: 0
    },
    agency_services: {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    agency_location: {
        type: String,
        required: true
    },
    agency_skills: {
        type: Array,
        default: []
    },
    agency_totalJob: {
        type: Number,
        default: 0
    },
    agency_portfolio: [agencyPortfolioSchema],
    agency_officeLocation: agencyOfficeLocationSchema,
    agency_companyInfo: agencyCompanyInfoSchema,
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

module.exports = mongoose.model('agency_profile', agencyProfileSchema)
