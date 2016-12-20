var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/Measurements');

router.get('/', function(req, res) {
    var collection = db.get('Pi');
    collection.find({}, function(err, pi){
        if (err) throw err;
      	res.json(pi);
    });
});

router.post('/', function(req, res){
    var collection = db.get('Pi');
    collection.insert({
        id: req.body.Id,
        name: req.body.Name,
        description: req.body.Description,
        location : req.body.Location,
        createdAt: req.body.CreatedAt,
        }, function(err, pi){
            if (err) throw err;
            res.json(pi);
    });
});

module.exports = router;
