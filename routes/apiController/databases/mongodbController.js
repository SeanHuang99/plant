const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plant = require('./models/Plant');
const ChatRecord=require('./models/chatRecord');
var app = express();
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

// Connect to MongoDB using Mongoose
mongoose.connect(uri)

// 设置回调
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


router.post('/addPlants', async (req, res) => {
    try {
        const { nickname, plant } = req.body;
        const newPlant = new Plant({ nickname, plant });
        await newPlant.save();
        res.status(201).send('Plant info uploaded successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/getPlants/:id', async (req, res) => {
    try {
        const { nickname } = req.params;
        const plantInfo = await Plant.findOne({ id });
        if (plantInfo) {
            res.status(200).json(plantInfo);
        } else {
            res.status(404).send('Plant info not found.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/getAllPlants', async (req, res) => {
    try {
        const plants = await Plant.find({});
        res.status(200).json(plants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Export the router
module.exports = router;

