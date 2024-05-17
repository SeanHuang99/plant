/**
 * @module Plant
 * @description the mongodb model of plant
 */

const mongoose = require('mongoose');

// define plant schema
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
    description: String, // plant description
    details: String, // plant detail
    datetime: Date, // the datetime when see the plant
    location: {  //location from Google map, lat: latitude, lng: longitude
        lat: Number,
        lng: Number,
    }, // location
    flowers: String, // whether have flower
    sunExposure: String, // sun exposure
    flowerColor: String, // color of flower
    status: String, // status of recognition
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