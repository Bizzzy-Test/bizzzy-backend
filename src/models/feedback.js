const uuid = require('uuid');
const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    //This field represents the user ID of the person giving the feedback.
    user_id_giver: {
        type: String,
        required: true
    },
    //This field represents the user ID of the person receiving the feedback.
    user_id_feedbacker: {
        type: String,
        required: true
    },
    private_feedback: {
        reason_for_ending_contract: {
            type: String,
            required: true
        },
        recommending_to_others: {
            type: Number,
            required: true
        },
        strengths: [{
            type: String,
        }],
        status: {
            type: Number,
            required: true,
            default: 1
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
    },
    public_feedback: {
        feedback: [{
            options: {
                type: String,
                required: true
            },
            ratings: {
                type: Number,
                required: true
            }
        }],
        description: {
            type: String
        },
        status: {
            type: Number,
            required: true,
            default: 1
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
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

module.exports = mongoose.model('feedback', feedbackSchema);