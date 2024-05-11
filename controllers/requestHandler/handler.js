const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoApi=require("../databaseController/mongodbController");


const upload = multer();

router.post("/addPlants",upload.none(),async function (req, res, next) {
    console.log('offline addPlant')
    let plantId=req.body.plantId;
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

    // console.log(`lat: ${lat}, lng: ${lng}`);

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
                console.log("dbpedia error: " + error.message);
                // res.status(504).send(error.message);
        });


    console.log("DBpediaName: "+DBpediaName);
    console.log("DBpediaDescription: "+DBpediaDescription);
    console.log("DBpediagenus: "+DBpediagenus);

    // mongodb storage
    mongoApi.addPlant(plantId,plantName, description, details, datetime, lat,lng, flowers, sunExpose, flowerColor, status, nickname, base64Image,resource,DBpediaName,DBpediaDescription,DBpediagenus)
        .then(function (response) {
            if (response.type === 'success') {
                // plantId = response.content;
                let plant = response.content;
                res.status(200).json(plant.plantId);
            } else {
                console.log("cannot add plants");
                res.status(504).send("cannot add plants");
            }
        })
        .catch(function (error) {
            console.log("error: " + error.message);
            res.status(504).send(error.message);
        })
})

router.post('/updatePlantsRequest', async function (req, res, next) {
    const { plantId, preferredPlantName, nickName } = req.body;

    const originalNickName = await mongoApi.getNickNameOfPlant(plantId);
    if (originalNickName.type === 'fail') {
        return res.status(404).json({ message: 'Plant not found' });
    }

    // If the uploader and the modifier are the same, update directly
    if (originalNickName.content === nickName) {

        const resource = `http://dbpedia.org/resource/${preferredPlantName}`;
        // console.log("DBPedia URL: "+resource)
        // The DBpedia SPARQL endpoint URL
        const endpointUrl = 'https://dbpedia.org/sparql';


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


        const result = await mongoApi.changePlantNameOfPlant(plantId, preferredPlantName,resource,DBpediaName,DBpediaDescription,DBpediagenus);
        if (result.type === 'success') {
            res.status(200).send('Plant name updated successfully');
        } else {
            console.error(`${result.content}`)
            res.status(500).json({ message: result.content });
        }
    } else {
        // If not the same, add an update request
        const result = await mongoApi.addUpdateRequest(plantId, preferredPlantName, nickName);
        if (result.type === 'success') {
            res.status(200).send('Update request submitted successfully');
        } else {
            console.error(`${result.content}`)
            res.status(500).json({ message: result.content });
        }
    }
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

router.get("/getAllUpdateRequests", function (req, res, next){
    const nickName = req.query.nickName; // Assume nickname is passed as a query parameter
    mongoApi.getAllUpdateRequestsByNickName(nickName)
        .then(function(response){
            if (response.type === 'success') {
                res.json(response); // Send success response back to client
            } else {
                res.status(404).json(response); // Send failure response back to client
            }
        })
        .catch(function(error){
            res.status(500).json({ type: 'fail', content: error.message });
        });
});
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