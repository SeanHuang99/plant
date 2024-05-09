const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const ChatRecord=require('./models/chatRecord');
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


function createPlantId(plantName) {
    const now = new Date();
    return `${plantName}${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;;
}

async function addPlant(plantName,
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
                        DBpediaLink,
                        DBpediaName,
                        DBpediaDescription,
                        DBpediaGunes)
{
    const now = new Date();
    const plantId = createPlantId(plantName);
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
            DBpediaLink,
            DBpediaName,
            DBpediaDescription,
            DBpediaGunes
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

async function addChatRecord(plantId,nickName,content){
    var response;
    const now = new Date();
    try {
        const chatRecord = new ChatRecord({plantId,nickName,content});
        await chatRecord.save();
        response={'type':'success','content':''};
    } catch (error) {
        response={'type':'fail','content':error.message};
    }
    return response;
}

async function getChatRecord(plantId) {
    var response;
    try {
        const chatRecords = await ChatRecord.find({ plantId: plantId }).sort({ date: 1 });
        if (chatRecords.length > 0) {
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


// Export the function
module.exports = { addPlant, getPlant, getAllPlants,addChatRecord,getChatRecord,getAllChatRecord};

