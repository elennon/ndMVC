var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const flash = require('express-flash');
const passport = require('passport');
const expressValidator = require('express-validator');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mqtt = require('mqtt');
const mongoose = require('mongoose');
const chalk = require('chalk');

const homeController = require('./controllers/homeCtrl');
const buildingController = require('./controllers/buildingCtrl');
const downloadController = require('./controllers/downloadCtrl');
const statusController = require('./controllers/chartsCtrl');
const contactController = require('./controllers/contact');
const userController = require('./controllers/user');
const passportConfig = require('./config/passport');
var regGroup = require('./routes/regGroup');
var bmp180 = require('./routes/bmp180');
var sht15 = require('./routes/sht15');
var sdp610 = require('./routes/sdp610');
var mlx906 = require('./routes/mlx906');
var cavityTemp = require('./routes/cavityTemp');
var hflux = require('./routes/hflux');
var weatherStation = require('./routes/weatherStation');
var pi = require('./routes/pi');
var building = require('./routes/building');

//dotenv.load({ path: '.env.example' });

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Measurements");
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '123',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/Measurements',
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.get('/', homeController.index);
app.post('/getReadings', homeController.getReadings);
app.post('/getPies', homeController.getPies);
app.get('/registerBuilding', buildingController.getBuilding);
app.get('/charts', statusController.getCharts);
app.get('/download', downloadController.getDownload);
app.post('/registerBuilding', buildingController.postBuilding);
app.post('/download', downloadController.postDownload);
app.post('/downloadExcel', downloadController.postExcelDownload);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.use('/api/bmp180', bmp180);
app.use('/api/sht15', sht15);
app.use('/api/sdp610', sdp610);
app.use('/api/mlx906', mlx906);
app.use('/api/cavityTemp', cavityTemp);
app.use('/api/hflux', hflux);
app.use('/api/weatherStation', weatherStation);
app.use('/api/pi', pi);
app.use('/pi', pi);
app.use('/api/building', building);
app.use('/building', building);
app.use(function(req, res, next){
  res.io = io;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
/**
 * Mqtt for charts.
 */
var options = {
    port: '1884',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    clean: false,
    username: 'me',
    password: 'secret',
};

var client = mqtt.connect('mqtt://139.59.172.240', options);

client.on('connect', function (connack) {
    client.subscribe('WeatherStation')
})
 
client.on('message', function(topic, message){
    let mes = JSON.parse(message);
    console.log(mes.time);
    var date = new Date().getTime();
    var temp = parseFloat(mes.wind_speed);
    io.sockets.emit('mqtt', date, temp);
});

client.on('error', function (error) {
    console.log('Error: ' + error);
});

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

module.exports = {app: app, server: server};
