const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ChatRecord', ChatSchema);