var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/Measurements';	

exports.index = (req, res) => {
    getBuilding(res, getPies);  
};

function getPies(res, buildings){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('Pi');
            collection.find().toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    res.render('home', {title: 'Home', buildings : buildings, pies : result, readings : {} });
                } else{
                    res.send('no thing found');
                }
            })
        }
        db.close();
    });
}

function getBuilding(res, callback){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('Building');
            collection.find().toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    callback(res, result)
                } else{
                    res.send('no thing found');
                }
            })
        }
        db.close();
    });
}

exports.getReadings = (req, res) => {
    var buildingId = req.body.building;
    var piId = req.body.pi;
    var sensor = req.body.sensor;
    var batch = parseInt(req.body.batch);
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection(sensor);
            collection.find({"ip": piId}).sort({"createdAt":-1}).limit(batch).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    res.render('partials/valTable', { readings : result });
                } else{
                    res.send('no thing found');
                }
            })
        }
        db.close();
    });
};

exports.getPies = (req, res) => {
    var building = req.body.building;
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection("Pi");
            collection.find({"group": building}).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    res.render('home', {title: 'Home', pies : result, readings : {} });
                } else{
                    res.send('no thing found');
                }
            })
        }
        db.close();
    });
}
//  .sort({"group": building})