const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const mongodbController = require('./mongodbController');

router.post('/updatePlantsRequestForCreator', async function (req, res, next) {
    const { objId, preferredPlantName, plantOriginalName, status } = req.body;
    console.log("Received objId:", objId);

    try {
        // 通过 objId 查找植物记录
        const plantResult = await mongodbController.findPlantByObjId(objId);
        if (plantResult.type === 'fail') {
            return res.status(404).json({ message: plantResult.content });
        }
        const plant = plantResult.content;

        const updateFields = {
            status: status,
            dbpedia: plant.dbpedia // 保留现有的 dbpedia 字段
        };

        if (preferredPlantName && preferredPlantName !== plantOriginalName) {
            // 构建 DBpedia 资源链接
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

        // 调用封装的控制器函数来更新植物记录
        const result = await mongodbController.changePlantNameOfPlantForCreator(objId, updateFields);

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

module.exports = router;
