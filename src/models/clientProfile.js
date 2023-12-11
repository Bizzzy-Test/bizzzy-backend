const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const clientProfileSchema = mongoose.Schema({
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
    businessName: {
        type: String,
        default: 'null'
    },
    briefDescription: {
        type: String,
        default: 'null'
    },
    profile_image: {
        type: String,
        default: 'null'
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


module.exports = mongoose.model('client_profile', clientProfileSchema)
