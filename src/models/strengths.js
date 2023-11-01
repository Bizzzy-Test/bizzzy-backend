const uuid = require('uuid');
const mongoose = require('mongoose');

const strengthsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('strengths', strengthsSchema);