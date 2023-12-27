const uuid = require('uuid');
const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    //This field represents the user ID of the person giving the feedback.
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    //This field represents the user ID of the person receiving the feedback.
    reciever_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    private_feedback: {
        reason_for_ending_contract: {
            type: String,
            required: true
        },
        recommending_others: {
            type: Number,
            required: true
        },
        status: {
            type: Number,
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
        average_rating: {
            type: String,
            required: true
        },
        feedback_message: {
            type: String,
            required: true
        },
        status: {
            type: Number,
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
        default: 1
    }
});

module.exports = mongoose.model('feedback', feedbackSchema);