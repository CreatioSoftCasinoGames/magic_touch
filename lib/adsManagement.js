var	queries = require('../dbConnection/queries.js');


var adsManagement = {};


adsManagement.updateAdsStatus = function updateAdsStatus(req, res) {
  console.log("in adsManagement line 4", req.body);
  var query = {};
  var updateData = req.body;
  queries.modifyAdsStatus(query, updateData, function (err, result) {
    if (err) {
      return res.json({success: false, info: 'Something went wrong!! unable to Update level Time'});
    } else {
      console.log('result----------', result);
      return res.json({success: true, result: result});
    }
  })
}


adsManagement.getAdsStatus = function getAdsStatus(req, res){
	var query = {};
	queries.getTheAdsStatus(query, function(err, result){
		if(err){
      return res.json({success: false, info: 'Something went wrong!! unable to Update level Time'});
		} else {
      return res.json({success: true, result: result});
		}
	})
}

// adsManagement.getConfig

module.exports = adsManagement ;
