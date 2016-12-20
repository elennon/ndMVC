var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Bmp180');
    collection.find({}, function(err, videos){
        if (err) throw err;
      	res.json(videos);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Bmp180');
    collection.insert({
        ok:req.body.Ok,
	message:req.body.Message,
	sensor: req.body.Sensor,
	ip: req.body.Ip,
	createdAt: req.body.CreatedAt,
	id: req.body.Id,
	pressure: req.body.Pressure,
	altitude: req.body.Altitude,
	temp: req.body.Temp
    }, function(err, bmp180){
        if (err) throw err;

        res.json(bmp180);
    });
});

module.exports = router;
