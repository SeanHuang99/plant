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
})
router.get('/about', function (req, res) {
    console.log('/about')
    res.render('about')
})
router.get('/detail', async function (req, res) {
    // console.log('/detail')
    // const {plantId} = req.params;

    // const plantId = req.query.plantId;
    // console.log(plantId)
    // const response = await mongoApi.getPlant(plantId)
    // if (response.type === 'success') {
    //     res.render('detail')
    // }
     res.render('detail')
})

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

router.get('/huangtest', function (req, res) {
    console.log('/huangtest')
    res.render('temptest')
})
module.exports = router;
