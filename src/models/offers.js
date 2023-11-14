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
    contract_title: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },  
    client_message: {
        type: String,
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
