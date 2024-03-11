const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MongoDB connection string
const uri = "mongodb+srv://web04Admin:project-22558800@web04.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";

// Connect to MongoDB using Mongoose
mongoose.connect(uri)

// 设置回调
mongoose.connection.on("open", () => {
    // 设置连接成功的回调
    console.log("MongoDb connect success");
});
mongoose.connection.on("error", () => {
    // 设置连接错误的回调
    console.log("MongoDb connect fail");
});
mongoose.connection.on("close", () => {
    // 设置连接关闭的回调
    console.log("MongoDb connection is closed");
});

// Define a Mongoose schema and model for the data you're working with
const plantSchema = new mongoose.Schema({
    nickname: String,
    description: String,
    // Add other fields as per your requirements
});

const Plant = mongoose.model('Plant', plantSchema);

// Route to add a new plant
router.post('/plants', async (req, res) => {
    try {
        const plant = new Plant({
            nickname: req.body.nickname,
            description: req.body.description,
            // Populate other fields from req.body
        });

        await plant.save();
        res.send(plant);
    } catch (error) {
        res.status(500).send('Error saving the plant: ' + error.message);
    }
});

// Route to get all plants
router.get('/plants', async (req, res) => {
    try {
        const plants = await Plant.find();
        res.send(plants);
    } catch (error) {
        res.status(500).send('Error retrieving plants: ' + error.message);
    }
});

// Export the router
module.exports = router;

