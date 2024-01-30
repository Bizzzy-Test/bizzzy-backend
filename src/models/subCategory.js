const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sub_category_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('sub_categories', subCategorySchema);