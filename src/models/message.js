const uuid = require('uuid');
const mongoose = require('mongoose');
const { messageType } = require('../constants')
const messageSchema = mongoose.Schema({
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
    job_id:{
        type: mongoose.Schema.Types.ObjectId
    },
    message_type: {
        type: Number,
        required: true,
        enum: [
            messageType.TEXT,
            messageType.INVITATION
        ]
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
        default: 0
    }
})

module.exports = mongoose.model('message', messageSchema);