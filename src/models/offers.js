const mongoose = require('mongoose');
const { budgetType, experienceType } = require('../constants/enum');

const OfferSchema = mongoose.Schema({
    freelencer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freelencer_profiles',
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
    status: {
        type: String,
        required: true
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

module.exports = mongoose.model('offers', OfferSchema);
