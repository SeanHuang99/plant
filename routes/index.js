var express = require('express');
const {getAllPlants, getPlant} = require("../controllers/apiController/databaseController/mongodbController");
const {all} = require("express/lib/application");
const fetch = require("node-fetch");
const axios = require("axios");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload',function (req, res){
  res.render('upload',{ title: 'Plants' })
})

router.get('/main',async function (req, res) {
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
      .then(data=>{
        res.render('main', {title: 'Main', plantList: data})
      })
})
router.get('/about',function (req, res){
  res.render('about')
})
router.get('/detail/:plantId',async function (req, res) {
    const {plantId} = req.params;
    // console.log(plantId)
    const response=await getPlant(plantId)
    // console.log(response.type)
    if (response.type==='success'){
        console.log(response.content)
        res.render('detail',{plant:response.content})
    }
})

/* test page. */
router.get('/testPage', function (req, res, next) {
  res.render('test', {title: 'Express',roomNo:"3gg4h20240322144734"});
});

module.exports = router;
