const uuid = require('uuid');
const mongoose = require('mongoose');

const reasonsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_type: {
        type: Number,
        enum: [
            userType.FREELANCER,
            userType.CLIENT
        ],
        required: true
    },
});

module.exports = mongoose.model('reasons', reasonsSchema);