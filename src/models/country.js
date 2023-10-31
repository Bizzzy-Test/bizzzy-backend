const uuid = require('uuid');
const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('countries', countrySchema);