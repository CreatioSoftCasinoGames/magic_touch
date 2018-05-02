var	queries = require('../dbConnection/queries.js');


var levelTime = {};


levelTime.updateLevelTime = function updateLevelTime(req, res) {
  console.log("in levelTime line 4", req.body);
  var query = {};
  // if(req.body.isLevelTime == 'false'){
  	// delete req.body.levelTimeList;
  // }
  var updateData = req.body;
  console.log("-------------line 14", updateData);
  queries.updateLevlTime(query, updateData, function (err, result) {
    if (err) {
      return res.json({success: false, info: 'Something went wrong!! unable to Update level Time'});
    } else {
      console.log('result----------', result);
      return res.json({success: true, result: result});
    }
  })
}


levelTime.getLevelTime = function getLevelTime(req, res){
	var query = {};
	queries.getLevlTime(query, function(err, result){
		if(err){
      return res.json({success: false, info: 'Something went wrong!! unable to Update level Time'});
		} else {
      return res.json({success: true, result: result});
		}
	})
}

module.exports = levelTime ;
