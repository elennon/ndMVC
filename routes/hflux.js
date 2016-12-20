var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Hflux');
    collection.find({}, function(err, hflux){
        if (err) throw err;
      	res.json(hflux);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Hflux');
    collection.insert({
        ok: req.body.Ok,
        message: req.body.Message,
        sensor: req.body.Sensor,
        ip: req.body.Ip,
        createdAt: req.body.CreatedAt,
        id: req.body.Id,
        val: req.body.Val
        }, function(err, hflux){
            if (err) throw err;
        res.json(hflux);
    });
});

module.exports = router;
