const uuid = require('uuid');
const mongoose = require('mongoose');
const { invitationStatus } = require('../constants');

const inviteSchema = mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [
            invitationStatus.PENDING,
            invitationStatus.ACCEPT,
            invitationStatus.REJECT
        ],
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
        required: true,
        default: false
    }
})

module.exports = mongoose.model('invitation', inviteSchema);