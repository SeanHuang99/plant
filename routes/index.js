var express = require('express');
// const {getAllPlants, getPlant} = require("../controllers/databaseController/mongodbController");
const mongoApi=require("../controllers/databaseController/mongodbController");
const {all} = require("express/lib/application");
const fetch = require("node-fetch");
const axios = require("axios");
//问题：此页面初始化时，由于是node.js后端，找不到/javascript/index.js里的webAPI组件
//如何在判断是否在线（navigator.onLine？）后跳转路由（res.render）？
// const {loadAllPlants}=require("../public/javascript/index")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log('aaa')
  res.render('index', { title: 'Express' });
});

router.get('/upload',function (req, res){
    console.log('/upload')
  res.render('upload',{ title: 'Plants' })
})

router.get('/main',async function (req, res) {
    console.log('/main')
  // 直接调用数据库接口
  //   const allPlants = await getAllPlants()
  // console.log(allPlants)
  // console.log('main page')
  // res.render('main', {title: 'Main', plantList: allPlants.content})

    // 使用axios请求
  // axios.get("http://localhost:3000/getAllPlants")
  //     .then(res=>{
  //       console.log(res)
  //       res.render('main', {title: 'Main', plantList: res.content})
  //     })

    // 使用fetch请求
    fetch("http://localhost:3000/requestHandler/getAllPlants")
        .then(response => {
            //在解析之前，响应的主体内容是原始的未经处理的数据流
            return response.json(); // 将响应主体解析为 JSON
        })
        .then(data => {
            // console.log(data)
            res.render('main', {title: 'Main', plantList: data})
        })
    // loadAllPlants().then(allPlants=>{
    //     res.render('main', {title: 'Main', plantList: allPlants})
    // })
})
router.get('/about', function (req, res) {
    console.log('/about')
    res.render('about')
})
router.get('/detail', async function (req, res) {
    // console.log('/detail')
    // const {plantId} = req.params;
    const plantId = req.query.plantId;
    // console.log(plantId)
    const response = await mongoApi.getPlant(plantId)
    if (response.type === 'success') {
        res.render('detail', {plant: response.content})
    }
     // res.render('detail')
})

router.get('/mongoImage/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const plant = await mongoApi.getPlant(id); // 假设这是一个函数来根据ID获取植物信息，包括图片
        if (!plant) {
            return res.status(404).send('Image not found');
        }
        // 返回图片数据
        res.setHeader('Content-Type', 'image/jpeg'); // 根据实际图片格式设置，例如 'image/png'
        res.send(Buffer.from(plant.imageData, 'base64'));
    } catch (error) {
        console.error('Failed to retrieve image:', error);
        res.status(500).send('Server error');
    }
});
/* test page. */
router.get('/testPage', function (req, res, next) {
    res.render('test', {title: 'Express', roomNo: "3gg4h20240322144734"});
});

router.get('/EJS-test',function (req, res) {
    res.render('EJS-test')
})
router.get('/mapTest',function (req, res) {
    res.render('mapTest')
})
module.exports = router;
