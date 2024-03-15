const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    plant: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Plant', PlantSchema);