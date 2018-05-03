const connection = require('./connection.js');
var config = require('./config.js');
const db = connection.getDb;

var queries = module.exports;

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
