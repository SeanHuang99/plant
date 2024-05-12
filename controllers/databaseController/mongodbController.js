const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const ChatRecord=require('./models/chatRecord');
// mongodbcontroller.js
const UpdateRequest = require('./models/updateRequest');

// var app = express();
// app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/web04?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

// Connect to MongoDB using Mongoose
mongoose.connect(uri)

// callback
mongoose.connection.on("open", () => {
    // call back of connect success
    console.log("MongoDb connect success");
});
mongoose.connection.on("error", () => {
    // call back of error
    console.log("MongoDb connect fail");
});
mongoose.connection.on("close", () => {
    // call back of db close
    console.log("MongoDb connection is closed");
});


// function createPlantId(plantName) {
//     const now = new Date();
//     return `${plantName}${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;;
// }

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


async function getPlant(id) {
    try {
        const plantInfo = await Plant.findOne({plantId: id});
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

async function addChatRecord(plantId,nickName,content){

    var response;
    const now = new Date();
    const newChat = {
        nickName: nickName,
        content: content,
        date: new Date() // 如果不指定日期，默认使用当前时间
    };
    try {
        const result = await ChatRecord.findOneAndUpdate(
            { plantId: plantId }, // 查询条件
            { $push: { chatList: newChat } }, // 要添加的聊天数据
            { new: true, upsert: true } // 选项: 返回更新后的文档，并在找不到时创建新文档
        );
        console.log('Updated Chat Record:', result);
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

// Add or update plant edit request (plantId, plantName, nickName)
async function addUpdateRequest(plantId, plantName, nickName, creator) {
    var response;
    try {
        const updateRequest = new UpdateRequest({ plantId, plantName, nickName, creator });
        await updateRequest.save();
        response = { type: 'success', content: '' };
    } catch (error) {
        response = { type: 'fail', content: error.message };
    }
    return response;
}

// Get plant edit request by plantId
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

// Get all plant edit requests
async function getAllUpdateRequests() {
    var response;
    try {
        const allRequests = await UpdateRequest.find({});
        response = { type: 'success', content: allRequests };
    } catch (error) {
        response = { type: 'fail', content: error.message };
    }
    return response;
}

// Update plant edit request's approval status
async function updateUpdateRequest(plantId, nickName, appOrdec) {
    var response;
    try {
        const result = await UpdateRequest.findOneAndUpdate(
            { plantId, nickName },
            { statusOfRequest: status },
            { new: true }
        );
        if (result) {
            response = { type: 'success', content: result };
        } else {
            response = { type: 'fail', content: 'Update request not found or could not be updated' };
        }
    } catch (error) {
        response = { type: 'fail', content: error.message };
    }
    return response;
}

async function getAllUpdateRequestsByNickName(creator) {
    let response;
    try {
        const updateRequests = await UpdateRequest.find({ creator });
        response = { 'type': 'success', 'content': updateRequests };
    } catch (error) {
        response = { 'type': 'fail', 'content': error.message };
    }
    return response;
}

// Export the function
module.exports = { addPlant, getPlant, getAllPlants, getNickNameOfPlant, changePlantNameOfPlant, addChatRecord,getChatRecord,getAllChatRecord, addUpdateRequest, getUpdateRequestById, getUpdateRequestById,
    getAllUpdateRequests, updateUpdateRequest, getAllUpdateRequestsByNickName};

