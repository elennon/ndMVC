var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');

exports.index = (req, res, next) => {
    if (req.session.user == undefined ){
        res.render('home', {title: 'Home', readings : {}, moment: moment, user : null });
    } else{
        var user = req.session.user;
        res.render('home', {title: 'Home', readings : {}, moment: moment, user : req.session.user });
    }
    //getBuilding(res, getPies);
};

function getPies(res, buildings){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('Pi');
            let defaultBuildingId = buildings[0].id;
            collection.find({"group": defaultBuildingId}).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    res.render('home', {title: 'Home', buildings : buildings, 
                        pies : result, readings : {}, moment: moment });
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
    });
}

function getBuilding(res, callback){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('Building');
            collection.find().sort({"name": 1}).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    callback(res, result);
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
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
            console.log('in getReadings at connected');
            var collection = db.collection(sensor);
            if (sensor === "WeatherStation") {
                collection.find().sort({"time":-1}).limit(batch).toArray(function(err, result){
                    if(err){
                        res.send(err);
                    } else if(result.length){
                        console.log('and the number is from getReadings no sort ********' + result.length)
                        res.render('partials/valTable', { readings : result, moment: moment, sensor: sensor });
                        db.close();
                    } else{
                        res.send('no thing found');
                        db.close();
                    }
                })
            } else {
                collection.find({"ip": piId}).sort({"createdAt":-1}).limit(batch).toArray(function(err, result){
                    if(err){
                        res.send(err);
                    } else if(result.length){
                        console.log('and the number is from getReadings no sort ********' + result.length)
                        res.render('partials/valTable', { readings : result, moment: moment, sensor: sensor });
                        db.close();
                    } else{
                        res.send('no thing found');
                        db.close();
                    }
                })
            }
        }        
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
                    //res.render('home', {title: 'Home', pies : result, readings : {}, moment: moment });
                    //res.setHeader('Content-Type', 'application/json');
                    //res.send(JSON.stringify({ pies: result }));
                    //res.send(JSON.stringify(result));
                    res.render('partials/piDropdown', { pies: result });
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
    });
}
//  .sort({"group": building})
