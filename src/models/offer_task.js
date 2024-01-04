const mongoose = require('mongoose');

const OfferTaskSchema = mongoose.Schema({
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    amount: {
        type: Number,// 0 - 
        default: 0
    },
    message: {
        type: String,
        required: true
    },
    file: {
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

module.exports = mongoose.model('offers_task', OfferTaskSchema);
