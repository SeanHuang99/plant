var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload',function (req, res){
    console.log('/upload')
    res.render('upload')
})

router.get('/main',async function (req, res) {
    res.render('main')
})
router.get('/about', function (req, res) {
    console.log('/about')
    res.render('about')
})
router.get('/detail', async function (req, res) {
     res.render('detail')
})

/* test page. */

// router.get('/testPage', function (req, res, next) {
//     res.render('test', {title: 'chat room test', roomNo: "3gg4h20240322144734"});
// });

// router.get('/EJS-test',function (req, res) {
//     res.render('EJS-test')
// })

// router.get('/mapTest',function (req, res) {
//     res.render('mapTest')
// })

// router.get('/huangtest', function (req, res) {
//     res.render('temptest')
// })

router.get('/getAllUpdateRequests', function (req, res) {
    // console.log('/getAllUpdateRequests')
    res.render('updateRequests')
})

router.get('/mockSubmit', function (req, res) {
    // console.log('/getAllUpdateRequests')
    res.render('mockSubmit')
})
module.exports = router;
