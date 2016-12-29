var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/Measurements';	

exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

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
