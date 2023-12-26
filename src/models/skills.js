const uuid = require('uuid');
const mongoose = require('mongoose');

const skillsSchema = mongoose.Schema({
    skill_name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

module.exports = mongoose.model('skills', skillsSchema);