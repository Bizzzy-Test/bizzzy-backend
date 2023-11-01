const uuid = require('uuid');
const mongoose = require('mongoose');

const feedbackOptionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('feedback_options', feedbackOptionSchema);