var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
// const { Loader } = require("@googlemaps/js-api-loader");
// import { Loader } from "@googlemaps/js-api-loader"


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var mongodbController = require('./controllers/apiController/databaseController/mongodbController');
var requestHandler=require("./controllers/requestHandler/handler");


var app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false , limit: '100mb'}));
// app.use('/public/', express.static(path
//     .join(__dirname, '/public/')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/mongodb',mongodbController);
app.use('/requestHandler',requestHandler);

// app.get('/', function (req, res) {
//   console.log('__dirname: '+__dirname)
//   // res.sendFile( __dirname + "/public/html/" + "mapTest.html" );
//   res.render("mapTest" );
// });// 显示html页面
// var server = app.listen(3001, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   //  服务器IP地址为127.0.0.1 端口为8888
//   console.log( "server is running"+host+port);
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
