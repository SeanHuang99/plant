const express = require('express');
const router = express.Router();
var app = express();
app.use(express.json());
const mongoApi=require("../databaseController/mongodbController");
const {response} = require("express");

router.post("/addPlants",function (req,res,next){
    const { description, details, datetime, location, flowers, sunExposure, flowerColor, name, status, nickname } = req.body;
    console.log("get plant add request:");
    console.log(req.body.location);
    console.log(nickname);

})

router.get("/getPlants/:id",function (req,res,next){

})

router.get("/getAllPlants",function (req,res,next){

})


/*
just for test for database
 */
router.get('/test',function (req, res, next){
    console.log("add char message");
    mongoApi.addChatRecord("rosemary20240321031045","hello","team04")
        .then(
            function(response){
                console.log(response.type);
                console.log(response.content);
            }
        )
        .catch(
            error => console.error(error)
        );
    return {'type':'success'};
});

module.exports = router;