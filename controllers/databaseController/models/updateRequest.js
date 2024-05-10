// updateRequest.js

const mongoose = require('mongoose');

const UpdateRequestSchema = new mongoose.Schema({
    plantId: {
        type: String,
        required: true,
    },
    plantName: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    approveOrdecline: {
        type: String,
        enum: ['Unreviewed', 'Approved', 'Declined'],
        default: 'Unreviewed',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('UpdateRequest', UpdateRequestSchema);
