var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Sdp610');
    collection.find({}, function(err, sdp610){
        if (err) throw err;
      	res.json(sdp610);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Sdp610');
    collection.insert({
        ok: req.body.Ok,
	message: req.body.Message,
	sensor: req.body.Sensor,
	ip: req.body.Ip,
	createdAt: req.body.CreatedAt,
	id: req.body.Id,
	val: req.body.Val
    }, function(err, sdp610){
        if (err) throw err;

        res.json(sdp610);
    });
});

module.exports = router;
