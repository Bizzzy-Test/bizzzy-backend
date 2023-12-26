const uuid = require('uuid');
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('categories', categorySchema);