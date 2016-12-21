var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/Measurements';	

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {"time": "time" });
});

router.get('/count', function(req, res) {
    MongoClient.connect(url, function (err, db) {	
        var collection = db.collection('Hflux');
        collection.count({}, function(error, numOfDocs){
            if(error) return callback(err);
            db.close();
            res.json(numOfDocs);    
        }); 
    });
});

router.post("/download",function(req,res){
	var fromdate=req.body.Fromdate;
	var todate = req.body.Todate
	var Senor = req.body.Senor
	var Format = req.body.Format 
	var request = require('request');
    request('http://139.59.172.240/api/hflux', function (error, response, body) {
        if (!error && response.statusCode == 200) {
			var noqs = body.replace(/\"/g, "")
			jsonfile.writeFile("tester.json", noqs, function (err) {
				console.error(err);
				res.download("tester.json");
			})			
        }
    }) 
});



module.exports = router;
