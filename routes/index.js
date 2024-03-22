var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/upload',function (req, res){
  res.render('upload',{ title: 'Plants' })
})

router.get('/main',function (req, res){
  
  res.render('main',{ title: 'Main' })
})
router.get('/about',function (req, res){
  res.render('about')
})
router.get('/detail/:plantId',function (req, res){
  const { plantId } = req.params;
  console.log(plantId)

  res.render('detail')
})

/* GET home page. */
router.get('/testPage', function (req, res, next) {
  res.render('testFormUpload', {title: 'Express'});
});

module.exports = router;
