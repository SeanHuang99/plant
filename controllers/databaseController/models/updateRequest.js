const mongoose = require('mongoose');
const UpdateRequestSchema = new mongoose.Schema({
    plantId: {
        type: String,
        required: true,
    },
    plantName: {
        type: String,
        required: true,
        index: true  // 单字段索引
    },
    nickName: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    statusOfRequest: {
        type: String,
        enum: ['completed', 'in-progress'],
        default: 'in-progress',
        index: true  // 单字段索引
    },
    date: {
        type: Date,
        default: Date.now,
        index: -1  // 单字段索引，降序
    },
    decision: {
        type: String,
        enum: ['agree', 'reject', ''],
        default: '',
    },
    plantOriginalName: {
        type: String,
        required: true,
    }
});

// Add a unique composite index for plantId and plantName
UpdateRequestSchema.index({ plantId: 1, plantName: 1 }, { unique: true });

// 创建复合索引
UpdateRequestSchema.index({ statusOfRequest: -1, date: -1, plantName: 1 });

const UpdateRequest = mongoose.model('UpdateRequest', UpdateRequestSchema);
module.exports = UpdateRequest;

