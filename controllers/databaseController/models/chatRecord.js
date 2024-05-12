const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    plantId:{
        type: String,
        required: true,
    },
    chatList: [{
        nickName: { type: String, required: true },
        content: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('ChatRecord', ChatSchema);