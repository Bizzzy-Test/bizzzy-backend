const mongoose = require('mongoose');
const { gigStatus } = require('../constants/enum');

const inviteSchema = mongoose.Schema({
    agency_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    member_position: {
        type: String,
        require: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: gigStatus.PENDING,
        enum: [
            gigStatus.PENDING,
            gigStatus.ACCEPT,
            gigStatus.REJECT
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

module.exports = mongoose.model('agency_invitation', inviteSchema);