var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Mlx906');
    collection.find({}, function(err, mlx906){
        if (err) throw err;
      	res.json(mlx906);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Mlx906');
    collection.insert({
        title: req.body.Title,
        ok: req.body.Ok,
	message: req.body.Message,
	sensor: req.body.Sensor,
	ip: req.body.Ip,
	createdAt: req.body.CreatedAt,
	id: req.body.Id,
	ambiTemp: req.body.AmbiTemp,
	skyTemp: req.body.SkyTemp
    }, function(err, mlx906){
        if (err) throw err;

        res.json(mlx906);
    });
});

module.exports = router;
