var express = require('express');
var router = express.Router();
const uuid = require('node-uuid');
var monk = require('monk');
var db = monk('localhost:27017/Measurements');

/* GET form. */
router.get('/', function(req, res) {
    res.render('registerGroup');
});

/* POST form. */
router.post('/', function(req, res) {
  var collection = db.get('Building');
  var bhb = uuid.v4();
    collection.insert({
        id: uuid.v4(),
        name: req.body.name,
        description: req.body.description,
        address : req.body.dddress,
        createdAt: Date.now(),
    }, function(err, pi){
        if (err) throw err;
        res.render('././index', {"time": "time" });
        //res.send('ok', 200);
        //res.render('registerGroup');
    });
});

module.exports = router;
