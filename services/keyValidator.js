var _ = require('underscore');
var keySets 					= {};
var optnlKeySets 			= {};
var internalFunctions = {};
var handlerFunctions 	= {};
var responseSet				= {};
var responsibleText 	= "No prediction";


keySets["affiliate"] = {
	createAdmin	: {name: "String", userName: "String", email: "String", gender: "String",
									dob: "Number", mobile: "Number", address: "String",
									city: "String", state: "String", country: "String", role:"String", roles:"String", status: "String"}
}

internalFunctions["affiliate"] 	= [];
handlerFunctions["affiliate"] 	= ["createAdmin", "login", "createAffiliate", "completePeningChip",
									"fundTransfer", "forgot"];

optnlKeySets['affiliate'] = {
	createAdmin	: {pincode: "Number"},
	login				:{userName: "String", password:"String"},
	forgot : {}
}











// Validate keys and generate proper response
keySets.validate = function (type, serverType, methodName, clientKeys, cb){
	if(!!!type || !!!serverType || !!!methodName || !!! clientKeys){
		return cb({success: false, info: "Missing serverType | methodName | clientKeys"});
	}

	if(type.toUpperCase() == "REQUEST") {
		var routeFromDict = keySets[serverType][methodName];
		responsibleText = " in request ";
	} else {
		var routeFromDict = responseSet[serverType][methodName];
		responsibleText = " in response ";
	}

	var optnlrouteFromDict	=  optnlKeySets[serverType][methodName];
	var missingKeys = [];
	var validateRespJson = {};
	if(internalFunctions[serverType].indexOf(methodName) >= 0) {
		responsibleText = " on server !";
	} else if (handlerFunctions[serverType].indexOf(methodName) >= 0) {
		responsibleText = " from client !";
	} else {
		return cb({success: false, info: 'No dictionary defined for function - ' + methodName + ' on '+ serverType + ' server!'});
		console.error('No dictionary defined for function - ' + methodName + ' on '+ serverType + ' server!');
	}
	for(key in routeFromDict){
		if(!clientKeys[key]){ // intentionally setting true for missing key for pushing key
			if(clientKeys[key] != false && clientKeys[key] != "") {
				missingKeys.push(key);
			} else{
				validateRespJson[key] = clientKeys[key];
			}
		} else{
				validateRespJson[key] = clientKeys[key];
		}
	}

	for(key in optnlrouteFromDict){
		if(!clientKeys[key]){ // intentionally setting true for missing key for pushing key
			if(clientKeys[key] != false && clientKeys[key] != "") {
				// do nothing
			} else{
				validateRespJson[key] = clientKeys[key];
			}
		} else{
				validateRespJson[key] = clientKeys[key];
		}
	}

	if(missingKeys.length > 0){
		console.error("Missing keys - [" + (missingKeys).toString() + "] in function - " + methodName + " " + responsibleText);
		return cb({success: false, info: "Missing keys - [" + (missingKeys).toString() + "] in function - " + methodName + " " + responsibleText});
	} else {
		return cb({success: true, result: validateRespJson});
	}
}

module.exports = keySets;
