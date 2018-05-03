var	queries = require('../dbConnection/queries.js');


var adsManagement = {};

/**
 * This method update the Ads visible status as per the request.
 * @method updateAdsStatus
 * @author Digvijay Singh
 * @date   2018-05-03
 * @param  {Object}        req [express request object]
 * @return {Object}            [a JSON object]
 */
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

/**
 * This method is used to get the Ads visible status.
 * @method getAdsStatus
 * @author Digvijay Singh
 * @date   2018-05-03
 * @param  {Object}     req [express request an empty object]
 * @return {Object}         [a JSON object containing levelTime status best time status and level time list]
 */
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
