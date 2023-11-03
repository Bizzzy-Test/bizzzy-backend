const mongoose = require('mongoose');

const TimerSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'users'
    },
    jobId: {
        type: String,
        required: true,
        ref: 'Job'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    duration: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    limite: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    file: {
        type: String
    },
    memo: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Timer', TimerSchema);
