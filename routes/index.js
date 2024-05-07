var express = require('express');
const {getAllPlants, getPlant} = require("../controllers/apiController/databaseController/mongodbController");
const {all} = require("express/lib/application");
const fetch = require("node-fetch");
const axios = require("axios");
//问题：此页面初始化时，由于是node.js后端，找不到/javascript/index.js里的webAPI组件
//如何在判断是否在线（navigator.onLine？）后跳转路由（res.render）？
// const {loadAllPlants}=require("../public/javascript/index")
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('aaa')
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
router.get('/detail/:plantId', async function (req, res) {
    console.log('/detail')
    const {plantId} = req.params;
    // console.log(plantId)
    const response = await getPlant(plantId)
    // console.log(response.type)
    if (response.type === 'success') {
        res.render('detail', {plant: response.content})
    }
})

/* test page. */
router.get('/testPage', function (req, res, next) {
    res.render('test', {title: 'Express', roomNo: "3gg4h20240322144734"});
});

module.exports = router;
