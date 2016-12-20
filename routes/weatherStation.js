var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('WeatherStation');
    collection.find({}, function(err, weatherStation){
        if (err) throw err;
      	res.json(weatherStation);
    });
});

router.post('/', function(req, res){
    var collection = db.get('WeatherStation');
    collection.insert({
		"wind_direction" : req.body.Wind_direction,
		"wind_speed" : req.body.Wind_speed,
		"corrected_direction" : req.body.Corrected_direction,
		"pressure" : req.body.Pressure,
		"RH_per_cent" : req.body.RH_per_cent,
		"temp" : req.body.Temp,
		"dew_point" : req.body.Dew_point,
		"precipitation" : req.body.Precipitation,
		"precipitation_intensity" : req.body.Precipitation_intensity,
		"time" : req.body.Time,
		"volys" : req.body.Volys,
		"status" : req.body.Status,
		"check" : req.body.Check
    }, function(err, weatherStation){
        if (err) throw err;
        res.json(weatherStation);
    });
});

module.exports = router;
