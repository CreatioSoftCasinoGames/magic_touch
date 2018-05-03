var	queries = require('../dbConnection/queries.js');


var levelTime = {};

/**
 * This method update the level time status and the level time as per the request.
 * @method updateLevelTime
 * @author Digvijay Singh
 * @date   2018-05-03
 * @param  {Object}        req [express request object]
 * @return {Object}            [a JSON object]
 */
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

/**
 * This method is used to get the level time status and the level list.
 * @method getLevelTime
 * @author Digvijay Singh
 * @date   2018-05-03
 * @param  {Object}     req [express request an empty object]
 * @return {Object}         [a JSON object containing levelTime status best time status and level time list]
 */
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

/**
 * This method is used to get all the configuration i.e. Level Time status, Best time status,
 * Level time list and ia Ads visible.
 * @method getAll
 * @author Digvijay Singh
 * @date   2018-05-03
 * @param  {Object}   req [express request an empty object]
 * @return {Object}       [a JSON object as a rsponse]
 */
levelTime.getAll = function (req, res) {
  var query = {};
  queries.getLevlTime(query, function (err, result) {
    if (err) {
      return res.json({success: false, info: 'Something went wrong!! unable to get level Time'});
    } else {
      delete result._id;
      if(result.isLevelTime == "false"){
        delete result.levelTimeList;
      }
      console.log("level time result-----------", result)
      queries.getTheAdsStatus(query, function(err, result2){
        if(err){
          return res.json({success: false, info: 'Something went wrong!! unable to get ads status'});
        } else {
          delete result2._id;
          console.log("ads result-----------", result2)
          return res.json({success: true, result: Object.assign(result, result2)});
        }
      })
    }
  })
}

module.exports = levelTime ;
