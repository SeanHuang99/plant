const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoApi=require("../databaseController/mongodbController");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/plantImages'); //确保这个目录已经存在
    },
    filename: function(req, file, cb) {
        var origin=file.originalname;
        var fileExtention=origin.split(".")
        var fileName=Date.now()+"-"+origin;
        cb(null, fileName); // 使用原始文件名
    }
});

const upload = multer({ storage: storage });

router.post("/addPlants",upload.single('photo'),function (req,res,next){
    console.log("add plant post request:");
    console.log(req.body);
    let nickname=req.body.nickname;
    let filePath=req.file.path;
    let description=req.body.description;
    let details=req.body.details;
    let datetime=req.body.datetime;
    let location=req.body.location;
    let flowers=req.body.flowers;
    let sunExpose=req.body.sunExposure;
    let flowerColor=req.body.flowerColor;
    let plantName=req.body.name;
    let status=req.body.status;

    let plantId;
    mongoApi.addPlant(plantName,description,details,datetime,location,flowers,sunExpose,flowerColor,status,nickname,filePath)
        .then(function(response){
            if(response.type==='success'){
                plantId=response.content;
                res.redirect(`/detail/${plantId}`);
            }
        })
        .catch(function(error){
            console.log("error: "+error.message);

        })
})

router.get("/getPlants/:id",function (req,res,next){
    const { id } = req.params;
    console.log(id)
    mongoApi.getPlant(id)
        .then(function(response){
            if(response.type==='success'){
                plant=response.content;
                res.json(plant);
            }
        })
        .catch(function(error){
            console.log("error: "+error.message);
            res.status(500).json(error.message);
        })

})

router.get("/getAllPlants",function (req,res,next){
    mongoApi.getPlant(plantId)
        .then(function(response){
            if(response.type==='success'){
                plant=response.content;
                res.status(200).json(plant);
            }
        })
        .catch(function(error){
            console.log("error: "+error.message);
            res.status(500).send(error.message);
        })
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