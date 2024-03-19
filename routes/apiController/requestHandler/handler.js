const express = require('express');
const router = express.Router();
var app = express();
app.use(express.json());

const now = new Date();
router.post("/addPlants",function (req,res,next){
    const formatted = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    console.log("get plant add request:");
    console.log(req.body);
    console.log(req.body.nickname);
    // var result={"hello":"response from add palnts"};
    // res.status(200).json(result);
})

router.get("/getPlants/{id}",function (req,res,next){

})

router.get("/getAllPlants",function (req,res,next){

})

module.exports = router;