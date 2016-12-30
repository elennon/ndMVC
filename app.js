/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
//const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

//dotenv.load({ path: '.env.example' });
const homeController = require('./controllers/homeCtrl');
const buildingController = require('./controllers/buildingCtrl');
const downloadController = require('./controllers/downloadCtrl');
const contactController = require('./controllers/contact');

var routes = require('./routes/index');
var readings = require('./routes/reading');
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
const app = express();
//app.use('/', routes);
app.use('/api/bmp180', bmp180);
app.use('/api/sht15', sht15);
app.use('/api/sdp610', sdp610);
app.use('/api/mlx906', mlx906);
app.use('/api/cavityTemp', cavityTemp);
app.use('/api/hflux', hflux);
app.use('/api/weatherStation', weatherStation);
app.use('/api/pi', pi);
app.use('/api/building', building);

app.use('/reading', readings);
// app.use('/regGroup', regGroup);
// app.use('/download', readings);
// app.use('/downloads', routes);
/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.connection.on('error', () => {
//   console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
//   process.exit();
// });

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "123",
//   store: new MongoStore({
//     url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//     autoReconnect: true
//   })
}));
app.use(flash());

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/', homeController.index);
app.post('/getReadings', homeController.getReadings);
app.post('/getPies', homeController.getPies);
app.get('/registerBuilding', buildingController.getBuilding);
app.get('/download', downloadController.getDownload);
app.post('/registerBuilding', buildingController.postBuilding);
app.post('/download', downloadController.postDownload);

/**
 * Error Handler.
 */
app.use(errorHandler());

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
