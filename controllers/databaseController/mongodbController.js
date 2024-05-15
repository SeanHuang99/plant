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
 * Get a plant by its ID.
 * @param {string} id - The ID of the plant.
 * @returns {Promise<{type: string, content: Object}>} The response containing the plant information or an error message.
 * @property {string} type - The type of the response, 'success' or 'fail'.
 * @property {Object} content - The content of the response, either the plant information or the error message.
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
    // Declare response at the start of the function
    let response = {
        type: 'fail',
        content: 'Unexpected error occurred'
    };

    try {
        // Query the plant record with the specified plantId
        const plantInfo = await Plant.findOne({ plantId: id });

        // If the plant information is found, return its nickname
        if (plantInfo) {
            response = {
                type: 'success',
                content: plantInfo.nickName
            };
        } else {
            // No matching plant record found
            response = {
                type: 'fail',
                content: 'Plant not found'
            };
        }
    } catch (error) {
        // Catch errors and return the error message
        response = {
            type: 'fail',
            content: error.message
        };
    }

    // Return the response
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
async function changePlantNameOfPlant(id, newPlantName,link,name,description,genus) {
    let response;
    try {
        const dbpedia={}
        dbpedia.link = link;
        dbpedia.name = name;
        dbpedia.description = description;
        dbpedia.genus = genus;
        // Update the plant name for the plant with the specified plantId
        const plantInfo = await Plant.findOneAndUpdate(
            { plantId: id }, // Find the plant by plantId
            { plantName: newPlantName ,dbpedia: dbpedia}, // Set the new plant name
            { new: true } // Return the updated document
        );

        // If the update was successful, return a success message
        if (plantInfo) {
            response = {
                type: 'success',
                content: `Plant name updated to '${newPlantName}'`
            };
        } else {
            // If no matching plant record was found
            response = {
                type: 'fail',
                content: 'Plant not found'
            };
        }
    } catch (error) {
        // Catch any errors and return an appropriate message
        response = {
            type: 'fail',
            content: error.message
        };
    }
    // Return the response
    return response;
}


/**
 * Finds a plant by its object ID.
 * @param {string} id - The object ID of the plant.
 * @returns {Promise<Object>} The response object containing the plant information or an error message.
 */
async function findPlantByObjId(id) {
    try {
        // 确保 id 是一个有效的 ObjectId
        const objectId = new mongoose.Types.ObjectId(id);
        const plant = await Plant.findById(objectId);
        if (!plant) {
            return { type: 'fail', content: 'Plant not found' };
        }
        return { type: 'success', content: plant };
    } catch (error) {
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
        const objectId = new mongoose.Types.ObjectId(id);
        // 更新植物记录
        const result = await Plant.findByIdAndUpdate(
            objectId,
            updateFields,
            { new: true }
        );

        if (result) {
            response = {
                type: 'success',
                content: 'Plant name and status updated successfully'
            };
        } else {
            response = {
                type: 'fail',
                content: 'Failed to update plant'
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
 * Add a chat record to a plant.
 * @param {string} plantId - The ID of the plant.
 * @param {string} nickName - The nickname of the user.
 * @param {string} content - The chat content.
 * @param {Date} date - The date of the chat.
 * @returns {Promise<Object>} The response indicating success or failure.
 */
async function addChatRecord(plantId,nickName,content,date){

    var response;
    // const now = new Date();
    const newChat = {
        nickName: nickName,
        content: content,
        date: date // 如果不指定日期，默认使用当前时间
    };
    try {
        const result = await ChatRecord.findOneAndUpdate(
            { plantId: plantId }, // 查询条件
            { $push: { chatList: newChat } }, // 要添加的聊天数据
            { new: true, upsert: true } // 选项: 返回更新后的文档，并在找不到时创建新文档
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
 * @returns {Promise<Object>} The response containing the chat records or an error message.
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
async function addUpdateRequest(plantId,
                                plantName,
                                nickName,
                                creator,
                                plantOriginalName) {
    var response;
    try {
        const updateRequest = new UpdateRequest({  plantId,
                                                                                        plantName,
                                                                                        nickName,
                                                                                        creator,
                                                                                        plantOriginalName});
        await updateRequest.save();
        response = { type: 'success', content: '' };
    } catch (error) {
        // Check if the error is a duplicate key error
        // console.log(error.name);
        if (error.code === 11000) {
            // Provide a custom message for duplicate key error
            response = { type: 'fail', content: 'This suggestion has already been submitted by someone.' };
        } else {
            // Handle other kinds of errors normally
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
        const updateRequest = await UpdateRequest.findOne({ plantId });
        if (updateRequest) {
            response = { type: 'success', content: updateRequest };
        } else {
            response = { type: 'fail', content: 'No update request found for this plant' };
        }
    } catch (error) {
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
        const updateRequests = await UpdateRequest.aggregate([
            { $match: { creator: creator } },  // 过滤匹配的文档
            { $sort: { statusOfRequest: -1, date: -1, plantName: 1 } },// 根据新字段和其他字段排序
            { $project: { sortPriority: 0 } }  // 选择性地移除用于排序的临时字段
        ]);
        response = { 'type': 'success', 'content': updateRequests };
    } catch (error) {
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

        if (!result) {
            throw new Error('No matching document found to update.');
        }

        return result;
    } catch (error) {
        console.error('Failed to update request:', error);
        throw error; // Rethrow or handle as needed
    }
}

// Export the function
module.exports = { addPlant, getPlant, getAllPlants, getNickNameOfPlant, changePlantNameOfPlant, addChatRecord,getChatRecord,getAllChatRecord, addUpdateRequest, getUpdateRequestById, getUpdateRequestById,
    getAllUpdateRequestsByNickName, updateRequestFromUrPage, changePlantNameOfPlantForCreator, findPlantByObjId};

