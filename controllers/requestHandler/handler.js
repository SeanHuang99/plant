const express = require('express');
const router = express.Router();
const mongoApi=require("../databaseController/mongodbController");
const {mongo} = require("mongoose");

/**
 * Adds a new plant to the database.
 * @route POST /addPlants
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
router.post("/addPlants",async function (req, res, next) {
    console.log(`service worker addPlant: ${req.body.plantId}`)
    let plantId=req.body.plantId;
    let nickname = req.body.nickName;
    let description = req.body.description;
    let details = req.body.details;
    let datetime = req.body.datetime;
    // let location = req.body.location;
    let lat = req.body.lat;
    let lng = req.body.lng;
    let flowers = req.body.flowers;
    let sunExpose = req.body.sunExposure;
    let flowerColor = req.body.flowerColorPicker;
    let plantName = req.body.plantName;
    let status = req.body.status;
    let base64Image = req.body.photo;

    // console.log(`lat: ${lat}, lng: ${lng}`);

    const resource = `http://dbpedia.org/resource/${capitalizeFirstLetterIfAlphabet(plantName)}`;
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
    res.status(200)
})





/**
 * Fetches the details of a specific plant by plant ID.
 * @route GET /getPlants/:id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
router.get("/getPlants/:id",function (req,res,next){
    console.log('getPlants')
    const { id } = req.params;
    mongoApi.getPlant(id)
        .then(function(response){
            if(response.type==='success'){
                plant=response.content;
                res.status(200).json(plant);
            }
        })
        .catch(function(error){
            console.log("error: "+error.message);
            res.status(500).json(error.message);
        })

})

/**
 * Fetches all plants from the database.
 * @route GET /getAllPlants
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
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

/**
 * Fetches chat records for a specific plant by plant ID.
 * @route GET /getChatRecordById/:id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
router.get("/getChatRecordById/:id",function (req,res,next){
    const { id } = req.params;
    // console.log('receive chat record request: '+id);
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

/**
 * Updates offline chat records to the mongoDB.
 * @route POST /updateOfflineChatRecordToServer
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
router.post('/updateOfflineChatRecordToServer', async function (req, res, next) {
    // req.body;
    console.log("updateOfflineChatRecordToServer: "+JSON.stringify(req.body));
    let request=req.body;
    for (let chatGroup of request){
        let plantId=chatGroup.plantId;
        // console.log("offline chat group by plantId: "+JSON.stringify(chatGroup.chatList))
        for(let chat of chatGroup.chatList){
            // console.log(chat);
            await mongoApi.addChatRecord(plantId, chat.nickName, chat.content, new Date(chat.date))
        }
    }
    res.status(200).send();
})

/**
 * Fetches all chat records from the database.
 * @route GET /getAllChatRecord
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 */
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

// router.get("/getAllUpdateRequests", function (req, res, next){
//     const nickName = req.query.nickName; // Assume nickname is passed as a query parameter
//     mongoApi.getAllUpdateRequestsByNickName(nickName)
//         .then(function(response){
//             if (response.type === 'success') {
//                 res.json(response); // Send success response back to client
//             } else {
//                 res.status(404).json(response); // Send failure response back to client
//             }
//         })
//         .catch(function(error){
//             res.status(500).json({ type: 'fail', content: error.message });
//         });
// });

/**
 * API Route for fetching update requests by nickname.
 * @name get/api/getAllUpdateRequests
 * @function
 * @memberof module:router
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
router.get("/api/getAllUpdateRequests", function (req, res, next) {
    const nickName = req.query.nickName;  // Get nickname from query parameter
    mongoApi.getAllUpdateRequestsByNickName(nickName)
        .then(function(response) {
            if (response.type === 'success') {
                res.json(response);  // Send success response
            } else {
                res.status(404).json(response);  // Send failure response
            }
        })
        .catch(function(error) {
            res.status(500).json({ type: 'fail', content: error.message });
        });
});


/**
 * API Route for updating plant requests.
 * @name post/updatePlantsRequest
 * @function
 * @memberof module:router
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
router.post('/updatePlantsRequest', async function (req, res, next) {
    var response;
    const { plantId, preferredPlantName, nickName, creator, plantOriginalName } = req.body;
    const originalNickName = await mongoApi.getNickNameOfPlant(plantId);
    if (originalNickName.type === 'fail') {
        return res.status(404).json({ message: 'Plant not found' });
    }

    // Check if the requester is the creator of the plant
    if (originalNickName.content === nickName) {
        const resource = `http://dbpedia.org/resource/${capitalizeFirstLetterIfAlphabet(preferredPlantName)}`;
        const endpointUrl = 'https://dbpedia.org/sparql';
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
        const encodedQuery = encodeURIComponent(sparqlQuery);
        const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

        let DBpediaName = "";
        let DBpediaDescription = "";
        let DBpediagenus = "";

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                let bindings = data.results.bindings[0];
                DBpediaName = bindings?.name?.value;
                DBpediaDescription = bindings?.comment?.value;
                DBpediagenus = bindings?.genus?.value;
            })
            .catch(function (error) {
                console.log("error: " + error.message);
                res.status(504).send(error.message);
            });

        // Update plant name and DBpedia information
        const result = await mongoApi.changePlantNameOfPlant(plantId, preferredPlantName, resource, DBpediaName, DBpediaDescription, DBpediagenus);
        if (result.type === 'success') {
            res.status(200).send('Plant name updated successfully');
        } else {
            console.error(`${result.content}`);
            res.status(500).json({ message: result.content });
        }
    } else {
        // If the requester is not the creator, add an update request
        const result = await mongoApi.addUpdateRequest(plantId, preferredPlantName, nickName, creator, plantOriginalName);
        if (result.type === 'success') {
            res.status(200).send('Update request submitted successfully');
        } else {
            res.status(400).json({ message: result.content });
        }
    }
});

/**
 * API Route for updating plant requests by creator.
 * @name post/updatePlantsRequestForCreator
 * @function
 * @memberof module:router
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
router.post('/updatePlantsRequestForCreator', async function (req, res, next) {
    const { objId, preferredPlantName, plantOriginalName, status } = req.body;
    try {
        const plantResult = await mongoApi.findPlantByObjId(objId);
        if (plantResult.type === 'fail') {
            return res.status(404).json({ message: plantResult.content });
        }
        const plant = plantResult.content;
        const updateFields = {
            status: status,
            dbpedia: plant.dbpedia  // Retain existing DBpedia field
        };

        if (preferredPlantName && preferredPlantName !== plantOriginalName) {
            const resource = `http://dbpedia.org/resource/${capitalizeFirstLetterIfAlphabet(preferredPlantName)}`;
            const endpointUrl = 'https://dbpedia.org/sparql';
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
            const encodedQuery = encodeURIComponent(sparqlQuery);
            const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

            let DBpediaName = "";
            let DBpediaDescription = "";
            let DBpediagenus = "";

            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    let bindings = data.results.bindings[0];
                    DBpediaName = bindings?.name?.value;
                    DBpediaDescription = bindings?.comment?.value;
                    DBpediagenus = bindings?.genus?.value;
                })
                .catch(function (error) {
                    console.log("error: " + error.message);
                    return res.status(504).send(error.message);
                });

            updateFields.plantName = preferredPlantName;
            updateFields.dbpedia = {
                link: resource,
                name: DBpediaName,
                description: DBpediaDescription,
                genus: DBpediagenus
            };
        }

        // Update plant name and status
        const result = await mongoApi.changePlantNameOfPlantForCreator(objId, updateFields);

        if (result.type === 'success') {
            res.status(200).send(result.content);
        } else {
            res.status(500).json({ message: result.content });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * API Route for processing update requests from the update requests page.
 * @name post/updatePlantsRequestFromURPage
 * @function
 * @memberof module:router
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
router.post('/updatePlantsRequestFromURPage', async function (req, res) {
    try {
        const requests = req.body.requests;
        await Promise.all(requests.map(async request => {
            const { plantId, plantName, date, decision, nickName } = request;
            const resource = `http://dbpedia.org/resource/${capitalizeFirstLetterIfAlphabet(plantName)}`;
            const endpointUrl = 'https://dbpedia.org/sparql';
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
            const encodedQuery = encodeURIComponent(sparqlQuery);
            const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

            let DBpediaName = "";
            let DBpediaDescription = "";
            let DBpediagenus = "";

            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    let bindings = data.results.bindings[0];
                    DBpediaName = bindings?.name?.value;
                    DBpediaDescription = bindings?.comment?.value;
                    DBpediagenus = bindings?.genus?.value;
                })
                .catch(function (error) {
                    console.log("error: " + error.message);
                    res.status(504).send(error.message);
                });

            await mongoApi.changePlantNameOfPlant(plantId, plantName, resource, DBpediaName, DBpediaDescription, DBpediagenus);
            await mongoApi.updateRequestFromUrPage(plantId, plantName, date, decision, nickName);
        }));
        res.status(200).send('All requests processed successfully.');
    } catch (error) {
        console.error('Error processing update requests:', error);
        res.status(500).send(error.message);
    }
});

/**
 * because in DBpedia, the name of plant always with uppercase on first letter
 * @param input
 * @returns {string}
 */
function capitalizeFirstLetterIfAlphabet(input) {
    // check input whether is string and not blank
    if (typeof input === 'string' && input.length > 0) {
        // 检查第一个字符是否为英文字母
        if (input[0].match(/[a-z]/i)) {
            // the first char is alphabetic, turn the first char to uppercase
            return input[0].toUpperCase() + input.slice(1);
        }
    }
    // if the first char is not string, then return the original input
    return input;
}

/**
------------------------------------------------------------------
 following content just for test api
 */

// router.get('/test',function (req, res, next){
//     console.log("add chat message");
//     mongoApi.addChatRecord("rosemary20240321031045","hello","team04")
//         .then(
//             function(response){
//                 console.log(response.type);
//                 console.log(response.content);
//             }
//         )
//         .catch(
//             error => console.error(error)
//         );
//     return {'type':'success'};
// });


module.exports = router;