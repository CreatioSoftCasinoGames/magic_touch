var config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.db_name;
var dbConnection = {};
var connection = module.exports;

connection.init = function init(callback) {
	console.log(url);
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log('Not Created!');
			callback(err)
		} else {
			callback(null);
			createColl(db);
			dbConnection.db = db;
			console.log('Database Created!');
		}
	});
};

connection.getDb = function getDb(){
	// if(dbConnection){
		return dbConnection.db;
	// }
}

connection.close_db = function close_db(){
	if(dbConnection.db){
		dbConnection.db.close();
	}
};

function createColl(db) {
	db.db(config.db_name).createCollection('users');
}
