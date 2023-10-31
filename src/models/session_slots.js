const uuid = require('uuid');
const mongoose = require('mongoose');

const sessionSlotsSchema = mongoose.Schema({
    _id: {
        type: String,
        default: () => uuid.v4().replace(/\-/g, ""),
        required: true
    },
    advisor_id: {
        type: String,
        required: true
    },
    session_slots: [{
        time_slots: [{
            type: String,
            required: true
        }]
    }],
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
})

module.exports = mongoose.model('session_slots', sessionSlotsSchema);
