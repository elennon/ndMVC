var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Sht15');
    collection.find({}, function(err, sht15){
        if (err) throw err;
      	res.json(sht15);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Sht15');
    collection.insert({
        ok:req.body.Ok,
	message:req.body.Message,
	sensor: req.body.Sensor,
	ip: req.body.Ip,
	createdAt: req.body.CreatedAt,
	id: req.body.Id,
	temp: req.body.Temp,
	rh: req.body.Rh,
	dew: req.body.Dew
    }, function(err, sht15){
        if (err) throw err;

        res.json(sht15);
    });
});

module.exports = router;
