const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const ChatRecord=require('./models/chatRecord');
const UpdateRequest = require('./models/updateRequest');

// MongoDB connection string
const uri = "mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/web04?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

// Connect to MongoDB using Mongoose
mongoose.connect(uri);

// callback
mongoose.connection.on("open", async () => {

    // call back of connect success
    console.log("MongoDb connect success");
    try {
        await UpdateRequest.ensureIndexes(); // Ensure that all indexes defined on the model are created
        console.log("Indexes ensured successfully");
    } catch (err) {
        console.log("Error ensuring indexes:", err);
    }
});
mongoose.connection.on("error", () => {
    // call back of error
    console.log("MongoDb connect fail");
});
mongoose.connection.on("close", () => {
    // call back of db close
    console.log("MongoDb connection is closed");
});


/**
* Add a new plant to the database.
* @param {string} plantId - The ID of the plant.
* @param {string} plantName - The name of the plant.
* @param {string} description - The description of the plant.
* @param {string} details - The details of the plant.
* @param {Date} datetime - The observation date and time.
* @param {number} lat - The latitude of the plant's location.
* @param {number} lng - The longitude of the plant's location.
* @param {string} flowers - The flower information of the plant.
* @param {string} sunExposure - The sun exposure information of the plant.
* @param {string} flowerColor - The flower color of the plant.
* @param {string} status - The identification status of the plant.
* @param {string} nickName - The nickname of the user.
* @param {string} photo - The base64 encoded photo of the plant.
* @param {string} DBpediaLink - The DBpedia link of the plant.
* @param {string} DBpediaName - The DBpedia name of the plant.
* @param {string} DBpediaDescription - The DBpedia description of the plant.
* @param {string} DBpediaGunes - The DBpedia genus of the plant.
 *
* @returns {Promise<{type: string, content: Object}>} The response containing the plant information or an error message.
* @property {string} type - The type of the response, 'success' or 'fail'.
* @property {Object} content - The content of the response, either the plant information or the error message.
*/

async function addPlant(plantId,
                        plantName,
                        description,
                        details,
                        datetime,
                        lat,
                        lng,
                        flowers,
                        sunExposure,
                        flowerColor,
                        status,
                        nickName,
                        photo,
                        DBpediaLink,
                        DBpediaName,
                        DBpediaDescription,
                        DBpediaGunes)
{
    const now = new Date();
    // const plantId = createPlantId(plantName);
    let dbpedia = {};
    dbpedia.link = DBpediaLink;
    dbpedia.name = DBpediaName;
    dbpedia.description = DBpediaDescription;
    dbpedia.genus = DBpediaGunes;
    let location = {};
    location.lat=lat;
    location.lng=lng;
    var response;
    try {
        const newPlant = new Plant({
            plantId,
            plantName,
            description,
            details,
            datetime,
            location,
            flowers,
            sunExposure,
            flowerColor,
            status,
            nickName,
            photo,
            dbpedia
        });
        await newPlant.save();
        // response={'type':'success','content':plantId};
        response={'type':'success','content':newPlant};
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

/**
 * Get all plants.
 * @returns {Promise<{type: string, content: Plant[]}>} The response containing all plants or an error message.
 * @property {string} type - The type of the response, 'success' or 'fail'.
 * @property {Plant[]} content - The content of the response, an array of all plants or an error message.
 */

async function getPlant(id) {
    try {
        const plantInfo = await Plant.findOne({plantId: id});
        // console.log(plantInfo)
        var response;
        if (plantInfo) {
            response={'type':'success','content':plantInfo};
        } else {
            response={'type':'fail','content':'plant cannot find'};
        }
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

/**
 * Get all plants.
 * @returns {Promise<type: string, content: Plant[]>} The response containing all plants or an error message.
 */

async function getAllPlants(){
    var response;
    try {
        const plants = await Plant.find({});
        response={'type':'success','content':plants};
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

/**
 * Gets the nickname of a plant by its ID.
 * @param {string} id - The ID of the plant.
 * @returns {Promise<Object>} The response object containing the nickname of the plant or an error message.
 */
async function getNickNameOfPlant(id) {
    let response = {
        type: 'fail',
        content: 'Unexpected error occurred'
    };

    try {
        const plantInfo = await Plant.findOne({ plantId: id });
        if (plantInfo) {
            response = {
                type: 'success',
                content: plantInfo.nickName
            };
        } else {
            response = {
                type: 'fail',
                content: 'Plant not found'
            };
        }
    } catch (error) {
        response = {
            type: 'fail',
            content: error.message
        };
    }

    return response;
}

/**
 * Changes the name of a plant and updates its DBpedia information.
 * @param {string} id - The ID of the plant.
 * @param {string} newPlantName - The new name of the plant.
 * @param {string} link - The DBpedia link for the plant.
 * @param {string} name - The DBpedia name for the plant.
 * @param {string} description - The DBpedia description for the plant.
 * @param {string} genus - The DBpedia genus for the plant.
 * @returns {Promise<Object>} The response object indicating success or failure.
 */
async function changePlantNameOfPlant(id, newPlantName, link, name, description, genus) {
    let response;
    try {
        const dbpedia = {
            link: link,
            name: name,
            description: description,
            genus: genus
        };
        const plantInfo = await Plant.findOneAndUpdate(
            { plantId: id },
            { plantName: newPlantName, dbpedia: dbpedia },
            { new: true }
        );

        if (plantInfo) {
            response = {
                type: 'success',
                content: `Plant name updated to '${newPlantName}'`
            };
        } else {
            response = {
                type: 'fail',
                content: 'Plant not found'
            };
        }
    } catch (error) {
        response = {
            type: 'fail',
            content: error.message
        };
    }
    return response;
}


/**
 * Finds a plant by its object ID.
 * @param {string} id - The object ID of the plant.
 * @returns {Promise<Object>} The response object containing the plant information or an error message.
 */
async function findPlantByObjId(id) {
    try {
        // Convert the string ID to a Mongoose ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Find the plant by its ObjectId
        const plant = await Plant.findById(objectId);

        // If the plant is not found, return a failure response
        if (!plant) {
            return { type: 'fail', content: 'Plant not found' };
        }

        // If the plant is found, return a success response with the plant data
        return { type: 'success', content: plant };
    } catch (error) {
        // If an error occurs, return a failure response with the error message
        return { type: 'fail', content: error.message };
    }
}

/**
 * Changes the name and status of a plant for the creator.
 * @param {string} id - The object ID of the plant.
 * @param {Object} updateFields - The fields to update.
 * @returns {Promise<Object>} The response object indicating success or failure.
 */
async function changePlantNameOfPlantForCreator(id, updateFields) {
    let response;
    try {
        // Convert the string ID to a Mongoose ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Find the plant by its ObjectId and update with the new fields
        const result = await Plant.findByIdAndUpdate(
            objectId,
            updateFields,
            { new: true } // Return the updated document
        );

        // If the update is successful, return a success response
        if (result) {
            response = {
                type: 'success',
                content: 'Plant name and status updated successfully'
            };
        } else {
            // If the plant is not found, return a failure response
            response = {
                type: 'fail',
                content: 'Failed to update plant'
            };
        }
    } catch (error) {
        // If an error occurs, return a failure response with the error message
        response = {
            type: 'fail',
            content: error.message
        };
    }

    return response;
}

/**
 * Add a chat record to a plant.
 * @param {string} plantId - The ID of the plant.
 * @param {string} nickName - The nickname of the user.
 * @param {string} content - The chat content.
 * @param {Date} date - The date of the chat.
 * @returns {Promise<{type: string, content: string}>} The response indicating success or failure.
 * @property {string} type - The type of the response, 'success' or 'fail'.
 * @property {string} content - The content of the response, either an empty string on success or an error message.
 */
async function addChatRecord(plantId,nickName,content,date){

    var response;
    // const now = new Date();
    const newChat = {
        nickName: nickName,
        content: content,
        date: date // default now
    };
    try {
        const result = await ChatRecord.findOneAndUpdate(
            { plantId: plantId }, // 查询条件
            { $push: { chatList: newChat } }, // the chat content
            { new: true, upsert: true } // return the updated data, and if the plantId is not exist, then create a new one
        );
        // console.log('Updated Chat Record:', result);
        if(result){
            response={'type':'success','content':''};
        }
        else{
            response={'type':'fail','content':'Cannot update chat record'};
        }
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

/**
 * Get chat records for a plant.
 * @param {string} plantId - The ID of the plant.
 * @returns {Promise<{type: string, content: Object}>} The response containing the chat records or an error message.
 * @property {string} type - The type of the response, 'success' or 'fail'.
 * @property {Object} content - The content of the response, either the chat records or an error message.
 */
async function getChatRecord(plantId) {
    var response;
    try {
        const chatRecords = await ChatRecord.findOne({ plantId: plantId });
        if (chatRecords.chatList.length > 0) {
            response = {'type': 'success', 'content': chatRecords};
        } else {
            response = {'type': 'fail', 'content': 'No chat records found for this plant'};
        }
    } catch (error) {
        response = {'type': 'fail', 'content': error.message};
    }
    return response;
}

/**
 * Get all chat records.
 * @returns {Promise<{type: string, content: Object[]}>} The response containing all chat records or an error message.
 * @property {string} type - The type of the response, 'success' or 'fail'.
 * @property {Object[]} content - The content of the response, either an array of all chat records or an error message.
 */
async function getAllChatRecord(){
    var response;
    try {
        const allChat = await ChatRecord.find({});
        response={'type':'success','content':allChat};
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

/**
 * Adds an update request for a plant.
 * @param {string} plantId - The ID of the plant.
 * @param {string} plantName - The new name of the plant.
 * @param {string} nickName - The nickname of the user making the request.
 * @param {string} creator - The nickname of the plant creator.
 * @param {string} plantOriginalName - The original name of the plant.
 * @returns {Promise<Object>} The response object indicating success or failure.
 */
async function addUpdateRequest(plantId, plantName, nickName, creator, plantOriginalName) {
    var response;
    try {
        // Create a new update request with the provided details
        const updateRequest = new UpdateRequest({ plantId, plantName, nickName, creator, plantOriginalName });

        // Save the update request to the database
        await updateRequest.save();

        // Return a success response
        response = { type: 'success', content: '' };
    } catch (error) {
        // If the error is a duplicate key error, return a specific failure response
        if (error.code === 11000) {
            response = { type: 'fail', content: 'This suggestion has already been submitted by someone.' };
        } else {
            // For other errors, return a general failure response
            response = { type: 'fail', content: 'Error processing request: ' + error.message };
        }
    }
    return response;
}



/**
 * Gets the update request by plant ID.
 * @param {string} plantId - The ID of the plant.
 * @returns {Promise<Object>} The response object containing the update request or an error message.
 */
async function getUpdateRequestById(plantId) {
    var response;
    try {
        // Find an update request by the plant ID
        const updateRequest = await UpdateRequest.findOne({ plantId });

        // If the update request is found, return a success response
        if (updateRequest) {
            response = { type: 'success', content: updateRequest };
        } else {
            // If the update request is not found, return a failure response
            response = { type: 'fail', content: 'No update request found for this plant' };
        }
    } catch (error) {
        // If an error occurs, return a failure response with the error message
        response = { type: 'fail', content: error.message };
    }
    return response;
}

/**
 * Gets all update requests by nickname.
 * @param {string} creator - The nickname of the creator.
 * @returns {Promise<Object>} The response object containing the update requests or an error message.
 */
async function getAllUpdateRequestsByNickName(creator) {
    let response;
    try {
        // Aggregate update requests matching the creator's nickname and sort them
        const updateRequests = await UpdateRequest.aggregate([
            { $match: { creator: creator } },
            { $sort: { statusOfRequest: -1, date: -1, plantName: 1 } },
            { $project: { sortPriority: 0 } }
        ]);

        // Return a success response with the update requests
        response = { 'type': 'success', 'content': updateRequests };
    } catch (error) {
        // If an error occurs, return a failure response with the error message
        response = { 'type': 'fail', 'content': error.message };
    }
    return response;
}

/**
 * Updates the request from the update requests page.
 * @param {string} plantId - The ID of the plant.
 * @param {string} plantName - The new name of the plant.
 * @param {string} date - The date of the request.
 * @param {string} decision - The decision for the request (agree/reject).
 * @param {string} nickName - The nickname of the user making the request.
 * @returns {Promise<Object>} The updated request object.
 * @throws {Error} Throws an error if no matching document is found.
 */
async function updateRequestFromUrPage(plantId, plantName, date, decision, nickName) {
    try {
        // Find and update the update request by plant ID, date, and nickname
        const result = await UpdateRequest.findOneAndUpdate(
            {
                plantId: plantId,
                date: date,
                nickName: nickName
            },
            {
                statusOfRequest: 'completed',
                decision: decision
            },
            {
                new: true // Return the updated document
            }
        );

        // If no matching document is found, throw an error
        if (!result) {
            throw new Error('No matching document found to update.');
        }

        // Return the updated request
        return result;
    } catch (error) {
        console.error('Failed to update request:', error);
        throw error;
    }
}

// Export the function
module.exports = { addPlant, getPlant, getAllPlants, getNickNameOfPlant, changePlantNameOfPlant, addChatRecord,getChatRecord,getAllChatRecord, addUpdateRequest, getUpdateRequestById, getUpdateRequestById,
    getAllUpdateRequestsByNickName, updateRequestFromUrPage, changePlantNameOfPlantForCreator, findPlantByObjId};

