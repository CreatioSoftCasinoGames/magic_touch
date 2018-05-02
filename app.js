var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
// var dashboard = require('./routes/dashboard');
var constants = require("./config/constants.js"),
		admin = require("./lib/admin.js");


var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));`
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/views/src/dashboard')));

app.use('/', index);

// app.use('/dashboard', dashboard);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

setTimeout(function(){

  console.log('About to create RSA Keys! on server restart');
  console.log('About to create Admin! on server restart');
  admin.createAdmin(constants.defaultAdmin);

  admin.insertModuleList();
  
  if(constants.removeAllLogs){
    console.log("\n\n\n\n************ All logs have been removed!! ************\n\n\n\n");
    console.log = function(){};
  }
  
}, 2000);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
