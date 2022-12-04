const mongoose = require('mongoose');

const shortlinkSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },

    short: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Shortlink', shortlinkSchema)