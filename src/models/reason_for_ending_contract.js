const uuid = require('uuid');
const mongoose = require('mongoose');

const reasonsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('reasons', reasonsSchema);