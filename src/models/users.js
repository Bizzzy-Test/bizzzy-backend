const uuid = require('uuid');
const mongoose = require('mongoose');
const { userType } = require('../constants');

const socialLoginSchema = mongoose.Schema({
    provider: {
      type: String,
      enum: ['facebook', 'google', 'apple'],
      required: true
    },
    id: {
      type: String,
      required: true
    }
});

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        enum: [
            userType.FREELANCER,
            userType.CLIENT
        ],
        required: true
    },
    country: {
        type: String,
    },
    social_logins: [socialLoginSchema],
    email_verification_token: {
        type: String
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    send_promo_emails: {
        type: Boolean,
        default: false
    },
    has_accepted_terms: {
        type: Boolean,
        default: false
    },
    date_registered: {
        type: Date,
        default: Date.now
    },
    password_reset_token: {
        token: String,
        expires: Date
    },
    last_login: {
        type: Date
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('users', userSchema);