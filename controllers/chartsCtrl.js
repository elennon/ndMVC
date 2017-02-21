'use strict';
var monk = require('monk');
var db = monk('localhost:27017/Measurements');
const uuid = require('node-uuid');
var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');

exports.getCharts = (req, res, next) => {
    if (req.session.user == undefined ){
        res.render('home', {title: 'Home', readings : {}, moment: moment, user : null });
    } else{
        getStarter(res);
    }
};

function getStarter(res){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('WeatherStation');
            collection.find().toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    result.forEach(function(value){
                        var tt = moment(value.time).unix();
                        value.time = tt * 1000;
                    });
                    res.render('charts', {title: 'wind speed', starter : result});
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
    });
}
