const mongoose = require('mongoose');
//define chat schema which is used for websocket chat room record synchronization
const ChatSchema = new mongoose.Schema({
    plantId:{
        type: String,
        required: true,
    },
    chatList: [{
        nickName: { type: String, required: true }, //user's name
        content: { type: String, required: true }, //
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('ChatRecord', ChatSchema);