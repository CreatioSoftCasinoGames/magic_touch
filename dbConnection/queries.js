const connection = require('./connection.js');
var config = require('./config.js');
const db = connection.getDb;
// var index = require('../routes/index');

var queries = module.exports;

// queries.userSignUp = function userSignUp(userData,cb){
// 	console.log('*******************************',db,userData)
// 	delete userData.success;
// 	db().db(config.db_name).collection('users').insertOne(userData,function(err,res){
// 		if(err){
// 			console.log('Error in SignUp',err);
// 			cb(err);
// 		}else{
// 			console.log('signUp success ',res.result);
// 			cb(null,res);
// 		}
// 	})
// }

// queries.isExist = function isExist(searchData,cb){
	
//   	console.log('##########3++++++++++=',Object.keys(db(config.db_name)));
// 	db().db(config.db_name).collection('users').findOne(searchData,function(err,res){
// 		if(err){
// 			console.log('Error in isExist',err);
// 			return cb(err);
// 		}else{
// 			console.log(' exist ',res);
// 			cb(null,res)
// 		}
// 	});
// }

// queries.updateUser = function updateUser(data,cb){
// 	// console.log('+++++++++++++++++++++++++++++++',data)
// 	db().db('flipCoin').collection('users').findAndModify(data.toFind,[],data.toUpdate,{new:true},function(err,res){
// 		if(err){
// 			console.log('Error in updateUser',err);
// 			return cb(err);
// 		}else{
// 			console.log('updateUser success',res);
// 			return cb(null,res);
// 		}
// 	})
// }

// queries.insertData = function insertData(data,cb){
// 	console.log("data in insert quesry-------", data);
// 	db().db('flipCoin').collection('gameData').insertOne(data, function(err, res){
// 		if(err){
// 			console.log('Error in inserData',err);
// 			return cb(err);
// 		}else{
// 			console.log('inserData success',res.result);
// 			return cb(null,res);
// 		}
// 	})
// }


// queries.insertMonthlyData = function insertMonthlyData(data, cb){
// 	console.log("data in insert quesry-------", data);
// 	db().db('flipCoin').collection(data.collection).findAndModify(data.toFind,[],data.toUpdate,{upsert: true, new:true},function(err,res){
// 		if(err){
// 			console.log('Error in inserData',err);
// 			return cb(err);
// 		}else{
// 			console.log('inserData success',res.result);
// 			return cb(null,res);
// 		}
// 	})
// }

// queries.getTopRank = function getTopRank(data, cb){
//   console.log("---------------data in getTopRank--------", data, typeof(data.collectionName));

// 	db().db('flipCoin').collection(data.collectionName).aggregate([{$group: {_id: "$netProfit", names:{$addToSet: "$_id"}}},{$sort: {_id: -1}}, {$limit: 10}]).toArray(function (err, result) {
// 		console.log("result in getTopRank ",JSON.stringify(result));
// 		if(err){
// 			console.log('Error in getTopRank',err);
// 			return cb(err);
// 		}else{
// 			console.log('getTopRank success',result);
// 			return cb(null,result);
// 		}
// 	});
// }

// queries.getMyRank = function getMyRank(data, cb){
//   console.log("---------------data in getMyRank query--------", data, typeof(data.collectionName));

// 	db().db('flipCoin').collection(data.collectionName).aggregate([{$group: {_id: "$netProfit"}}, {$match: {_id: {$gte: data.netProfit}}}/*, { $count: "rank"}*/]).toArray(function (err, result) {
// 		console.log("result in getMyRank ",JSON.stringify(result));
// 		if(err){
// 			console.log('Error in getMyRank',err);
// 			return cb(err);
// 		}else{
// 			console.log('getMyRank success',result);
// 			return cb(null,[{rank: result.length}]);
// 		}
// 	});
// }

// queries.findUserData = function findUserData(data, cb){
// 	console.log('\ndbquery-------', data);
// 	db().db('flipCoin').collection(data.collectionName).findOne({ _id : data.userName } ,function(err,res){
// 		if(err){
// 			console.log('Error in isExist',err);
// 			return cb(err);
// 		}else{
// 			console.log(' exist ',res);
// 			cb(null,res)
// 		}
// 	});
// }

												// ----Dashboard Queries Starts Here---- //

queries.getAdmin = function(query, callback) {
	db().db('magicTouch').collection('admin').find(query).skip(0).limit(parseInt(query.limit) ).toArray(function (err, result) {
			// console.log('in dbquery'+JSON.stringify(result));
		callback(err, result);
	})
}

queries.createAdmin = function(userData, callback) {
	console.log("createAffiliate called",userData)
		db().db('magicTouch').collection('admin').insert(userData, function (err, result) {
			console.log("=================",err, result);
			callback(err, result);
		});
}

queries.getUser = function(query, callback) {
		db().db('magicTouch').collection('admin').findOne(query, function (err, result) {
		// console.log("getUser called == ",query, err, result);
			callback(err, result);
		});
}

queries.createSessionForLoggedInUser = function(query, data, callback){
	 db().db('magicTouch').collection('loggedInAdmin').update(query, data, {upsert: true}, function(err, result) {
		//console.log("err, result====", err, result);
		callback(err, result);
	});
}

queries.findSessionForLoggedInUser = function(query, callback){
	 db().db('magicTouch').collection('loggedInAdmin').findOne(query, function(err, result) {
		//console.log("err, result====", err, result);
		callback(err, result);
	});
}

queries.listModule = function(query,callback){
	// console.log("listModule called",query)
	db().db('magicTouch').collection('moduleAdmin').find(query).toArray(function (err, result) {
		callback(err, result);
	})
}

queries.removeAdminModules = function(query,callback){
	// console.log("listModule called",query)
	db().db('magicTouch').collection('moduleAdmin').remove({}, function (err, result) {
		callback(err, result);
	})
}

queries.insertModuleList = function(query,callback){
	console.log("insertModuleList called",query)
	db().db('magicTouch').collection('moduleAdmin').insert(query,function (err, result) {
		callback(err, result);
	})
}

queries.updateLevlTime = function(query,updateData, callback){
	console.log("updateLevlTime called",query, updateData);
	db().db('magicTouch').collection('levelTime').update(query, updateData, {upsert: true}, function(err, result) {
		callback(err, result);
	});
}

queries.getLevlTime = function(query, callback){
	db().db('magicTouch').collection('levelTime').findOne({}, function(err, result){
		callback(err, result);
	})
}

queries.modifyAdsStatus = function(query,updateData, callback){
	console.log("modifyAdsStatus called",query, updateData);
	db().db('magicTouch').collection('adsStatus').update(query, updateData, {upsert: true}, function(err, result) {
		callback(err, result);
	});
}

queries.getTheAdsStatus = function(query, callback){
	db().db('magicTouch').collection('adsStatus').findOne({}, function(err, result){
		callback(err, result);
	})
}
												// ----Dashboard Queries Ends Here---- //
