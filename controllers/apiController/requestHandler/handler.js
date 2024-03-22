const express = require('express');
const router = express.Router();
const mongoApi=require("../databaseController/mongodbController");

router.post("/addPlants",function (req,res,next){
    console.log("get plant add request:");
    console.log(req.body);
    console.log(req.body.nickname);
    res.json(req.body);
})

router.get("/getPlants/:id",function (req,res,next){

})

router.get("/getAllPlants",function (req,res,next){

})


/*
just for test api
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


router.post('/add', function (req, res, next) {
    console.log(req.body);
    let firstNo = req.body.firstNumber;
    let secondNo = req.body.secondNumber;
    console.log(firstNo);
    console.log(secondNo);
    res.json(req.body);
});

module.exports = router;