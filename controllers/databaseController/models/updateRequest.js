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
    creator:{
        type: String,
        required: true,
    },
    statusOfRequest: {
        type: String,
        enum: ['completed', 'in-progress'],
        default: 'in-progress',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    decision: {
        type: String,
        enum: ['agree', 'reject', ''],
        default: '',
    },
});

module.exports = mongoose.model('UpdateRequest', UpdateRequestSchema);
