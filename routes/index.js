var express = require('express');
var router = express.Router();
var admin = require('../lib/admin.js');
var levelTime = require('../lib/levelTime.js');
var adsManagement = require('../lib/adsManagement.js');





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/checkUserSessionInDb', function (req, res) {
  // console.log("checkUserSessionInDb hit ", req.body);
  admin.checkAffiliateSession(req, res);
})

router.post('/login',function(req,res){
	console.log("-------line7", req.body);
  admin.login(req, res)
});

router.post('/getModuleList',function(req,res){
	console.log("-------line13", req.body);
  admin.moduleList(req, res)
});

router.post('/updateLevelTime',function(req,res){
	console.log("-------line35", req.body);
  levelTime.updateLevelTime(req, res);
});

router.get('/getLevelTime',function(req,res){
	console.log("-------line37", req.body);
  levelTime.getLevelTime(req, res);
});


router.post('/updateAdsStatus',function(req,res){
	console.log("-------line43", req.body);
  adsManagement.updateAdsStatus(req, res);
});

router.get('/getAdsStatus',function(req,res){
	console.log("-------line51", req.body);
  adsManagement.getAdsStatus(req, res);
});

// router.get('./getConfiguration', function(req, res){
//   console.log("\n\n\n\n----------req.body", req.body)
//   adsManagement.getConfig(req.body,function getRank(err,result) {
//     if(err){
//       console.log('Error in getRank',err);
//       res.status(500).send(err);
//     }else{
//       console.log('getRank success');
//       res.send(result)
//     }
//   })
// })

module.exports = router;
