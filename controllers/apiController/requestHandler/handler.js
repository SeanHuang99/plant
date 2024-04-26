const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetch = require('node-fetch');
const querystring = require('querystring');
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

router.post("/addPlants",upload.single('photo'),async function (req, res, next) {
    // console.log("add plant post request:");
    // console.log(req.body);
    console.log('offline addPlant')
    let nickname = req.body.nickname;
    let filePath = req.file.path;
    let description = req.body.description;
    let details = req.body.details;
    let datetime = req.body.datetime;
    let location = req.body.location;
    let flowers = req.body.flowers;
    let sunExpose = req.body.sunExposure;
    let flowerColor = req.body.flowerColor;
    let plantName = req.body.name;
    let status = req.body.status;

    //todo: DBPedia url generation
    const sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbpedia: <http://dbpedia.org/resource/>
        
        SELECT ?plant WHERE {
          ?plant dbo:commonName dbpedia:"${plantName}"@en.
          FILTER (lang(?description) = "en")
          
        }
        LIMIT 1
    `;

    const encodedQuery = querystring.stringify({ query: sparqlQuery });
    const dbpediaSparqlEndpoint = `http://dbpedia.org/sparql?${encodedQuery}&format=json`;

    try {
        const response = await fetch(dbpediaSparqlEndpoint, {headers: {Accept: 'application/json'}});
        // const data = await response.json();
        console.log(response);
        const plantInfo = data.results.bindings.length > 0 ? data.results.bindings[0] : null;
    }catch (error) {
        console.error("Error during DBpedia SPARQL query:", error);
        res.status(504).send(error.message);
    }

    //mongodb storage
    let plantId;
    mongoApi.addPlant(plantName, description, details, datetime, location, flowers, sunExpose, flowerColor, status, nickname, filePath)
        .then(function (response) {
            if (response.type === 'success') {
                // plantId = response.content;
                let plant = response.content;
                res.status(200).json(plant.plantId);
                //同时添加到IndexDB
                openPlantsIDB().then(db => {
                    addNewPlantsToIDB(db, plant)
                })
                openSyncPlantsIDB().then(db=>{
                    addNewPlantToSync(db,plant)
                })
            } else {
                res.status(504).send("cannot add plants");
            }
        })
        .catch(function (error) {
            console.log("error: " + error.message);
            res.status(504).send(error.message);
        })
})

router.get("/getPlants/:id",function (req,res,next){
    console.log('getPlants')
    const { id } = req.params;
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
    mongoApi.getAllPlants()
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

router.get("/getChatRecordById/:id",function (req,res,next){
    const { id } = req.params;
    console.log('receive chat record request: '+id);
    mongoApi.getChatRecord(id)
        .then(function(response){
            if(response.type==='success'){
                chatHistory=response.content;
                res.status(200).json(chatHistory);
            }
        })
        .catch(function(error){
            console.log("error: "+error.message);
            res.status(500).send(error.message);
        })
})

/*
------------------------------------------------------------------
 following content just for test api
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