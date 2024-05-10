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
    location: locationSchema, // 观察位置
    flowers: String, // 植物是否有花
    sunExposure: String, // 日照情况
    flowerColor: String, // 花的颜色
    status: String, // 识别状态
    nickName: {
        type: String,
        required: true,
    },
    photo: String, // base64 photo
    //todo:定义DBpediaScheme?
    DBpediaLink: String,
    DBpediaName: String,
    DBpediaDescription: String,
    DBpediaGunes: String
});

module.exports = mongoose.model('Plants', PlantSchema);