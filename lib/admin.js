var async = require('async'),
  keyValidator = require("../services/keyValidator.js"),
  queries = require('../dbConnection/queries.js'),
  generator = require('generate-password'),
  jwt = require('jsonwebtoken'),
  uuid = require('uuid'),
  JwtKeyPvtKey = require('../config/constants.js').JWTPrivateKey,
  validateInput = require("../services/utilService.js"),
  passwordUtil = require("../services/passwordEncryptDecrypt.js");

var admin = {};

/**
 * This method calls the keyvalidator with the type, fileName, method name and the client keys which
 * are going to be validated. It returns the validated response if succes : true, otherwise the info
 * of the error if success : false.
 *  
 * @method validateKeySets
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {String}        type       
 * @param  {String}        fileName   [contains the name from which we are going to take keys used for validation]
 * @param  {String}        methodName [this take the name of the method for which we are using validation]
 * @param  {Object}        clientKeys [the client keys as object from request object]
 * @param  {Function}      cb         [callback as a response containing validated keys or info]
 */
var validateKeySets = function (type, fileName, methodName, clientKeys, cb) {
  keyValidator.validate(type, fileName, methodName, clientKeys, function (validateResponse) {
    if (validateResponse.success) {
      cb(validateResponse)
    } else {
      cb({success: false, info: validateResponse.info})
    }
  })
}

/**
 * This method generate a random password everytime of length 8including numbers and uppercase characters.
 * 
 * @method generatePassword
 * @author Digvijay Singh
 * @date   2018-04-12
 * @return {String}         [a random string of length 8 containing number, uppercase letters]
 */
var generatePassword = function () {
  var password = generator.generate({
    length: 8,
    numbers: true,
    uppercase: true
  })
  return password
}

/**
 * This method validate the keysets which are coming inn the data from request object.
 * 
 * @method validateKeySetsSignup
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}              reqData  [a query object containing admn data]
 * @param  {Function}            callback [callback as a response containing validated key sets]
 */
var validateKeySetsSignup = function(reqData, callback){
  validateKeySets('Request', 'affiliate', 'createAdmin', reqData, function (validated) {
    if (validated.success) {
      callback(null, validated.result)
    } else {
      console.log('Key Validation Failed')
      callback({success: false, info: validated.info})
    }
  })
}

/**
 * This method checks that the user is existing wih the username or not.
 * 
 * @method checkAlreadyExists
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}           validateKeys [validated key sets]
 * @param  {Function}         callback     [callback as a response]
 */
var checkAlreadyExists = function (validateKeys, callback) {
  console.log('Checking do any admin exist')
  queries.getAdmin({roles: 'admin'}, function (err, result) {
    if (err) {
      callback({success: false, info: 'Something went wrong!! unable to get admin list'})
    } else {
      console.log('Admin already exist', result.length)
      if (result.length) {
        console.log('Admin already exist')
        callback({success: false, info: 'Admin already exist'})
      } else {
        console.log('No Admin exist')
        callback(null, validateKeys)
      }
    }
  })
}

/**
 * This method insert the admin data in db and create the admin.
 * 
 * @method insertAdminData
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}        adminData [validated admin data]
 * @param  {Function}      callback  [callback as a response]
 */
var insertAdminData = function (adminData, callback) {
  console.log('Going to create admin', JSON.stringify(adminData))
  var password = generatePassword()
  var encrypted = passwordUtil.encrypt(password)
  if (encrypted.success) {
    adminData.password = encrypted.result
    if(adminData.chipsManagement){
      adminData.chipsManagement = adminData.chipsManagement;
    }
    if(adminData.rakeCommision || adminData.rakeCommision == 0){
      adminData.rakeCommision = adminData.rakeCommision;
    }
    if(adminData.realChips || adminData.realChips == 0){
      adminData.realChips = adminData.realChips;
    }
    if(adminData.profit || adminData.profit == 0){
      adminData.profit = adminData.profit;
    }
    if(adminData.withdrawal || adminData.withdrawal == 0){
      adminData.withdrawal = adminData.withdrawal;
    }
    queries.createAdmin(adminData, function (err) {
      if (err) {
        callback({success: false, info: 'Something went wrong!! unable to create admin'})
      } else {
        console.log('Admin successfully created')
        callback(null, adminData, password)
      }
    })
  } else {
    callback('unable to decode password')
  }
}

/**
 * This method is used just to show password on the console.
 * 
 * @method sendAdminData
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}      adminData [validated admin data]
 * @param  {String}      password  [the unique generated password]
 * @param  {Function}    callback  [callback as a response]
 */
var sendAdminData = function (adminData, password, callback) {
  console.log('Send password to email')
  console.log(password)
    // send password in email
  callback(null, adminData)
}


/**
 * This method is used to create the admin of the dashboard.It is called evry time the server starts.
 * If the admin is present then it return from that function of waterfall directly otherwise it create
 * the admin and sends the password on console.
 * 
 * @method createAdmin
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}    reqDatas [a request data]
 * @return {String}             [info on the console]
 */
admin.createAdmin = function (reqDatas) {
    // console.log("Entered into createAdmin :", JSON.stringify(reqDatas));
  async.eachSeries(reqDatas, function (reqData, cb) {
    if(reqData.role.level == 0){
      // console.log(reqData);
    }
    async.waterfall([
      async.apply(validateKeySetsSignup, reqData),
      checkAlreadyExists,
      insertAdminData,
      sendAdminData
    ], function (err, result) {
      console.log("-------------------",err, result);
      if (err) {
        console.log(err.info)
      } else {
        console.log('Admin successfully created')
        cb()
      }
    })
  }, function (err) {
    if (err) {
      console.log('Error in creating admin')
    } else {
      console.log('admin created successfully')
    }
  })
}

/**
 * This method validate the log-in keys entered by admin.
 * 
 * @method validateLoginKeys
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}          params   [log-in credentials]
 * @param  {Function}        callback [callback as a response]
 */
var validateLoginKeys = function (params, callback) {
  console.log('Validating Keys', params)
  validateKeySets('Request', 'affiliate', 'login', params, function (validated) {
    if (validated.success) {
      console.log('Key Validation Passed', validated.result)
      callback(null, validated.result)
    } else {
      console.log('Key Validation Failed')
      callback({success: false, info: validated.info})
    }
  })
}

/**
 * This method checks whether the admin exists with that usernae that user has passed in credentials.
 * 
 * @method checkAdminExists
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}         validateKeys [validated key sets]
 * @param  {Function}       callback     [callback as a response]
 */
var checkAdminExists = function (validateKeys, callback) {
  console.log('Getting user detail based on credential', JSON.stringify(validateKeys))
  var query = {}
  if (validateInput.validateEmail(validateKeys.userName)) {
    query['email'] = validateKeys.userName
  } else {
    query['userName'] = validateKeys.userName
  }
  queries.getUser(query, function (err, result) {
    if (err) {
      callback({success: false, info: 'Something went wrong!! unable to get affiliate list'})
    } else {
      if (result && result.status == 'Active') {
        console.log('User found', result)
        callback(null, result, validateKeys.password)
      } else if (result && result.status == 'Block') {
        console.log('User blocked!')
        callback({success: false, info: 'User blocked!'})
      } else {
        console.log('No user found with credential')
        callback({success: false, info: 'Invalid Username or Password'})
      }
    }
  })
}

/**
 * This function matches the password of the user credentials passed with the password stored in the db.
 * 
 * @method matchPassword
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}      affilData [the data of the admin]
 * @param  {String}      password  [password from the entered credentials]
 * @param  {Function}    callback  [callback as a response]
 */
var matchPassword = function (affilData, password, callback) {
  console.log('Going to match password' + JSON.stringify(affilData))
  var decrypted = passwordUtil.decrypt(affilData.password)
  console.log(decrypted, '== decrypted')
  if (decrypted.success) {
    console.log(1)
    if ((decrypted.result === password)) {
      console.log(2)
      if (affilData.isBlocked !== true) {
         // console.log(3)
        var tokenPayload = {
        name: affilData.name,
        userName: affilData.userName,
        email: affilData.email,
        role: affilData.role,
        timestamp: Number(new Date())
      }
        var token = jwt.sign(tokenPayload, JwtKeyPvtKey, {expiresIn: 6})
        var respData = JSON.parse(JSON.stringify(tokenPayload))
        respData.token = token
        respData.isParent = affilData._id
        respData.loggedinUserMobileNum = affilData.mobileNumber || affilData.mobile
        respData.moduleAccess = affilData.module
        respData.department = affilData.role.name
        respData.uniqueSessionId = uuid.v4();
        console.log(5, respData)
        callback(null, respData)
      } else {
        console.log('User has been blocked by admin')
        callback({success: false, info: 'You are blocked by admin'})
      }
    } else {
      console.log('invalid user')
      callback({success: false, info: 'Invalid Username or Password'})
    }
  } else {
    callback('unable to encrypt password')
  }
}

/**
 * This method is executed after the password gets matched and it store the session of the admin 
 * with the data in db.
 * 
 * @method createSessionForAdmin
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}              validateKeys [validated key sets]
 * @param  {Function}            callback     [callback as a response]
 */
var createSessionForAdmin =function (validateKeys, callback) {
  console.log('Going to create user session in DB ', JSON.stringify(validateKeys));
  var query = {};
  query.userName = validateKeys.userName;
  query.email = validateKeys.email;
  queries.createSessionForLoggedInUser(query, validateKeys, function(err, result){
    if(!err && result){
      callback(null, validateKeys)
    }
    else{
      callback({success: false, info: "Unable to create user session in DB."});
    }
  })
}

/**
 * This method is used when admin log-in in the dashboard.
 * 
 * @method login
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}   req [a express request object containing username and password]
 * @return {Object}       [a Json object containing success, result]
 */
admin.login = function (req, res) {
  req.body.userName = eval('/^'+ req.body.userName +'$/i');
  console.log('Entered into login :', JSON.stringify(req.body))
   // try{
  async.waterfall([
    async.apply(validateLoginKeys, req.body),
    checkAdminExists,
    matchPassword,
    createSessionForAdmin
  ], function (err, result) {
    console.log('9, err, result-------', err, result)
    if (err) {
      console.log(err.info)

      return res.json(err)

    } else {
      return res.json({success: true, result: result})
               
    }
  })
}




/**
 * This method is used to list the Dashboard Module of the Admin Dashboard.
 * 
 * @method moduleList
 * @author Digvijay Singh
 * @date   2018-02-19
 * @param  {Object}   req [a express request object]
 * @param  {Callback} res [function as a response]
 * @return {Object}       [a JSON object containing success: Boolean, result: Array object, rTL: Boolean, authToken: String]
 */
admin.moduleList = function (req, res) {
  console.log()
  queries.listModule({}, function (err, result) {
    if (err) {
      console.log(err)
      return res.json({success: false, info: 'Something went wrong!! unable to get table', rTL: false, authToken: req.body.authToken})
    } else {
            // admindb.InsertAdminLog(decoded.name, decoded.userName, "Table", "list", "table for game has been listed", JSON.stringify(req.body));
      console.log('result----------', result)
      return res.json({success: true, result: result, rTL: false, authToken: req.body.authToken})
    }
  })
}

/**
 * This method is called to insert the Admin module list in the database. This function is called 
 * once if there is no moduleAdmin collecton is present in the adminDB database.
 * First the modules are listed and if there is any modules present in the Database then the
 * module list is not inserted and if not then the module list get inserted in the database.
 * 
 * @method insertModuleList
 * @author Digvijay Singh
 * @date   2018-02-19
 * @param  {Object}         req [a express request object]
 * @param  {Callback}       res [callback as a response]
 */
admin.insertModuleList = function (req, res) {
  var moduleArray = [{
      name: 'Level Management',
      code: 101,
      iconClass: 'icon-home',
      status: true,
      subModule: [
        {
          name: 'Level Time',
          code: 102,
          route: 'levelTime',
          iconClass: 'icon-puzzle',
          status: true
        }
      ]
    },
    {
      name: 'Ads Management',
      code: 201,
      iconClass: 'icon-home',
      status: true,
      subModule: [
        {
          name: 'Ads Management',
          code: 202,
          route: 'adsManagement',
          iconClass: 'icon-puzzle',
          status: true
        }
      ]
    }
  ]

  queries.listModule({}, function (err, result) {
    if (err) {
      console.log(err)
    } else if (result && (result.length != moduleArray.length)) {
      console.log('--Going to insert module list--')
      queries.removeAdminModules({}, function(err, result){
        if(!err && result){
          queries.insertModuleList(moduleArray, function (err, result) {
            if (err) {
              console.log(err)
            } else {
              console.log('---Successfully inserted module list for admins---')
            }
          })
        }
        else{
          console.log("Something went wrong. Unable to update admin modules");
        }
      })
    } else {
      console.log('---Already present module list for admins---')
    }
  })
}

/**
 * This method checks for the session of the admin in dashboard.
 * 
 * @method checkAffiliateSession
 * @author Digvijay Singh
 * @date   2018-04-12
 * @param  {Object}              req [a express request object]
 * @return {object}                  [a JSON object containing success, result or error]
 */
admin.checkAffiliateSession = function (req, res) {
  // console.log("checkAffiliateSession == ", req.body);
  // res.send('success')
  queries.findSessionForLoggedInUser(req.body, function (err, result) {
    if (!err && result) {
      // console.log("\n\n\n\n\n\nline 3136 ", JSON.stringify(result));
      return res.json({success: true, result: result})
    } else {
      return res.json({success: false,  err: err});
    }
  })
}

module.exports = admin ;
