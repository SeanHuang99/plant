const mongoose = require('mongoose');
// 定义 Location Schema
const locationSchema = new mongoose.Schema({
    //todo: Double?
    lat: String,
    lng: String,
});
const PlantSchema = new mongoose.Schema({
    plantId:{
        type: String,
        unique: true,
        required: true,
    },
    plantName: {
        type: String,
        required: true,
    },
    description: String, // 植物描述
    details: String, // 植物详细信息
    datetime: Date, // 观察日期和时间
    location: {
        lat: Number,
        lng: Number,
    }, // location
    flowers: String, // 植物是否有花
    sunExposure: String, // 日照情况
    flowerColor: String, // 花的颜色
    status: String, // 识别状态
    nickName: {
        type: String,
        required: true,
    },
    photo: String, // base64 photo
    dbpedia: {  // Nested object for DBpedia-related information
        link: String,
        name: String,
        description: String,
        genus: String
    }
});

module.exports = mongoose.model('Plants', PlantSchema);