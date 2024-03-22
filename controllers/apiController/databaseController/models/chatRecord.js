const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    plantId:{
        type: String,
        unique: true,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ChatRecord', ChatSchema);