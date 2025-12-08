const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    image: {
        type: String,  // Store image URL or file path
        required: false
    }
});

module.exports = mongoose.model('Category', categorySchema);
