const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoApi=require("../databaseController/mongodbController");


const upload = multer();

router.post("/addPlants",upload.none(),async function (req, res, next) {
    console.log('offline addPlant')
    let nickname = req.body.nickname;
    let description = req.body.description;
    let details = req.body.details;
    let datetime = req.body.datetime;
    // let location = req.body.location;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let flowers = req.body.flowers;
    let sunExpose = req.body.sunExposure;
    let flowerColor = req.body.flowerColor;
    let plantName = req.body.name;
    let status = req.body.status;
    let base64Image = req.body.base64Image;

    console.log("location: "+location)

    const resource = `http://dbpedia.org/resource/${plantName}`;
    // console.log("DBPedia URL: "+resource)
    // The DBpedia SPARQL endpoint URL
    const endpointUrl = 'https://dbpedia.org/sparql';

    // <!--        PREFIX dbo: <http://dbpedia.org/ontology/>-->
    // <!--        PREFIX dbr: <http://dbpedia.org/resource/>-->
    // <!--        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>-->
    // <!--        PREFIX foaf: <http://xmlns.com/foaf/0.1/>-->
    // <!--        PREFIX dbp: <http://dbpedia.org/property/>-->
    // <!--        SELECT ?name ?genus ?comment ?uri-->
    // <!--        WHERE {-->
    // <!--          BIND(dbr:Basil AS ?uri)-->
    // <!--          OPTIONAL { ?uri dbp:name ?name . FILTER (langMatches(lang(?name), "en")) }-->
    // <!--          OPTIONAL { ?uri dbp:genus ?genus . FILTER (langMatches(lang(?genus), "en")) }-->
    // <!--          OPTIONAL { ?uri rdfs:comment ?comment . FILTER (langMatches(lang(?comment), "en")) }-->
    // <!--        }-->
    // <!--        LIMIT 1-->

    // The SPARQL query to retrieve data for the given resource
    const sparqlQuery = `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX dbp: <http://dbpedia.org/property/>
    SELECT ?name ?comment ?genus
    WHERE {
        OPTIONAL {<${resource}> dbp:name ?name . FILTER (langMatches(lang(?name), "en"))}
        OPTIONAL {<${resource}> rdfs:comment ?comment . FILTER (langMatches(lang(?comment), "en"))}
        OPTIONAL {<${resource}> dbp:genus ?genus . FILTER (langMatches(lang(?genus), "en"))}
    }
    LIMIT 1
    `;

    // Encode the query as a URL parameter
    const encodedQuery = encodeURIComponent(sparqlQuery);
    // Build the URL for the SPARQL query
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    let DBpediaName="";
    let DBpediaDescription="";
    let DBpediagenus="";

    await fetch(url)
        .then(response => response.json())
        .then(data => {
            // The results are in the 'data' object
            let bindings = data.results.bindings[0];
            let result = JSON.stringify(bindings);
            // console.log(result)
            DBpediaName = bindings?.name?.value;
            DBpediaDescription = bindings?.comment?.value;
            DBpediagenus = bindings?.genus?.value;
        })
        .catch(function (error) {
                console.log("error: " + error.message);
                res.status(504).send(error.message);
        });


    console.log("DBpediaName: "+DBpediaName);
    console.log("DBpediaDescription: "+DBpediaDescription);
    console.log("DBpediagenus: "+DBpediagenus);

    // mongodb storage
    mongoApi.addPlant(plantName, description, details, datetime, lat,lng, flowers, sunExpose, flowerColor, status, nickname, base64Image,resource,DBpediaName,DBpediaDescription,DBpediagenus)
        .then(function (response) {
            if (response.type === 'success') {
                // plantId = response.content;
                let plant = response.content;
                res.status(200).json(plant.plantId);
            } else {
                res.status(504).send("cannot add plants");
            }
        })
        .catch(function (error) {
            console.log("error: " + error.message);
            res.status(504).send(error.message);
        })
})

router.post("/updatePlants",upload.none(),async function (req, res, next) {

    res.status(200).send("updated");
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

router.get("/getAllChatRecord",function (req,res,next){
    mongoApi.getAllChatRecord()
        .then(function(response){
            if(response.type==='success'){
                chat=response.content;
                res.status(200).json(chat);
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
    console.log("add chat message");
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