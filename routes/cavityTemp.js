var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('CavityTemp');
    collection.find({}, function(err, cavityTemp){
        if (err) throw err;
      	res.json(cavityTemp);
    });
});

router.post('/', function(req, res){
    var collection = db.get('CavityTemp');
    collection.insert({
        ok:req.body.Ok,
	message:req.body.Message,
	sensor: req.body.Sensor,
	ip: req.body.Ip,
	createdAt: req.body.CreatedAt,
	id: req.body.Id,
	val: req.body.Val
    }, function(err, cavityTemp){
        if (err) throw err;

        res.json(cavityTemp);
    });
});

module.exports = router;
