var request = require('request');
var jsonfile = require('jsonfile');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var util = require('util');
var json2xls = require('json2xls');
var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');
var exel = require('../models/exel.js');
var jstoxml = require('jstoxml');
var excelbuilder = require('msexcel-builder');
var excel = require('node-excel-export');

exports.getDownload = (req, res) => {
    if (req.session.user == undefined ){
        res.render('home', {title: 'Home', readings : {}, moment: moment, user : null });
    } else{
        res.render('download', {title: 'Download' });
    }
};

exports.postDownload = (req, res) => {
    var fromdate = req.body.Fromdate;// new Date(req.body.Fromdate).getTime();
	var todate = new Date(req.body.Todate).getTime();
    var pi = req.body.dl_pi;
    var sensor = req.body.dl_sensor;
	var format = req.body.format;
    //let filename = util.format('%s-%s-%s-%s-%s', building, pi, sensor, fromdate, todate) , {"createdAt": {"$gte": fromdate }} 
    let filename = "data"; // {"ip": pi}
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection(sensor);
            if (sensor === "WeatherStation") {
                collection.find({"time": {"$gte": "2017-02-05T17:07:55+00:00" }}).toArray(function(err, result){
                //collection.find().limit(1000).toArray(function(err, result){
                //collection.find().limit(60000).toArray(function(err, result){ //{"time": {"$gte": fromdate }} // 109609
                    if(err){
                        res.send(err);
                    } else if(result.length){
                        downloadResult(result, format, res, filename, "WeatherStation", db);
                    } else{
                        res.send('no thing found');
                        db.close();
                    }
                })
            } else {
                collection.find({"ip": pi , "createdAt": {"$gte": fromdate }}).toArray(function(err, result){        
                    if(err){
                        res.send(err);
                    } else if(result.length){                       
                        downloadResult(result, format, res, filename, sensor, db);
                    } else{
                        res.send('no thing found');
                        db.close();
                    }
                })
            }
        }
    });
};

function downloadResult(result, format, res, filename, sensor, db){
    console.log("result count is: " + result.length);
    switch(format){
        case 'json':
            jsonfile.writeFile(filename + ".json", result, {flags:'w'}, function (err) {
                res.download("data.json");
                db.close();
            })	
            break;
        case 'xml':
            var xml = jstoxml.toXML(JSON.stringify(result));
            fs.writeFile(filename + '.xml', xml, {flags:'w'}, function(err, data){
                if (err) console.log(err);
                console.log("successfully written our update xml to file");
                res.download("data.xml");
                db.close();
            })
            break;
        case 'excel':
            console.log("in ecxel :" + result.length);
            exel(res, sensor, result, db);           
            break;
    } 
}

exports.postExcelDownload = (req, res) => {
    var building = req.body.exdl_building;
    var fromdate = new Date(req.body.exdl_fromdate).getTime();
	exel(res, selected, result, db);     
};


// function doWeather(res, db, collection, fromdate, filename){
//     //collection.find({"time": {"$gte": fromdate }}).sort({"time":-1}).limit(100).toArray(function(err, result){
//     //collection.find({"time": {"$gte": fromdate }}).limit(100).toArray(function(err, result){
//     collection.find().sort({"time":-1}).limit(100).toArray(function(err, result){
//         if(err){
//             res.send(err);
//         } else if(result.length){
//             downloadResult(result, format, res, filename, "WeatherStation", db);
//             db.close();
//         } else{
//             res.send('no thing found');
//             db.close();
//         }
//     })
// }