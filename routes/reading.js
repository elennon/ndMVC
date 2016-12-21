var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/Measurements';	

router.get('/weather', function(req, res) {
    MongoClient.connect(url, function (err, db) {	
        var collection = db.collection('WeatherStation');
        collection.count({}, function(error, numOfDocs){
            if(error) return callback(err);
            db.close();
            res.json(numOfDocs);    
        }); 
    });
});

router.get('/wstime', function(req, res) {
    MongoClient.connect(url, function(err, db) {
		var collection = db.collection('WeatherStation');
		var cursor = collection.find().sort({ "time" : -1 }).limit(1);
		cursor.toArray(function(err, results) {
			if (err) throw err;
			console.log('%j', results);
			var a = new Date(results[0].createdAt);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
            if(hour.toString().length < 2) {hour = '0' + hour}
			var min = a.getMinutes();
            if(min.toString().length < 2) {min = '0' + min}
			var sec = a.getSeconds();
            if(sec.toString().length < 2) {sec = '0' + sec}

			var time = date + ' ' + month + ' ' + hour + ':' + min + ':' + sec ;
			res.json(time);
			db.close();
		});
	});
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

router.get('/time', function(req, res) {
    MongoClient.connect(url, function(err, db) {
		var collection = db.collection('Hflux');
		var cursor = collection.find().sort({ "createdAt" : -1 }).limit(1);
		cursor.toArray(function(err, results) {
			if (err) throw err;
			console.log('%j', results);
			var a = new Date(results[0].createdAt);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
            if(hour.toString().length < 2) {hour = '0' + hour}
			var min = a.getMinutes();
            if(min.toString().length < 2) {min = '0' + min}
			var sec = a.getSeconds();
            if(sec.toString().length < 2) {sec = '0' + sec}

			var time = date + ' ' + month + ' ' + hour + ':' + min + ':' + sec ;
			res.json(time);
			db.close();
		});
	});
});

/* GET form. */
router.get('/', function(req, res) {
    res.render('reading');
});

/* POST form. */
router.post('/', function(req, res) {
  console.log(req.body.comment);
  res.redirect('index');
});

module.exports = router;
