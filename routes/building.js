var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Building');
    collection.find({}, function(err, building){
        if (err) throw err;
      	res.json(building);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Building');
    collection.insert({
        id: req.body.Id,
        name: req.body.Name,
        description: req.body.Description,
        location : req.body.Location,
        createdAt: req.body.CreatedAt,
        }, function(err, building){
            if (err) throw err;
            res.json(building);
    });
});

module.exports = router;