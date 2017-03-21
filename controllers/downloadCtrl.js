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
    //var fromdate =  moment(req.body.Fromdate).format();/// new Date(req.body.Fromdate).getTime();
    
	var todate = new Date(req.body.Todate).getTime();
    var pi = req.body.dl_pi;
    var sensor = req.body.dl_sensor;
	var format = req.body.format;
    var building = req.body.dl_building
    //let filename = util.format('%s-%s-%s-%s-%s', building, pi, sensor, fromdate, todate) , {"createdAt": {"$gte": fromdate }} 
    let filename = "data"; // {"ip": pi}
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection(sensor);
            if (sensor === "WeatherStation") {
                var fromdate = moment(req.body.Fromdate, 'MM/DD/YYYY', true).format();
                collection.aggregate(
                [
                    { "$match": {time: { $gt: fromdate } } },
                    //{ "$match": { "ip": { "$in": pies }, createdAt: { $gt: t } } },
                    //{ $match: { ip: "95978631-9454-4626-9748-eaec860c42eb" } },
                    //{ $match: { createdAt: { $gt: t } } },
                    { $group : { _id : "$time", row: { $push: "$$ROOT" } } }
                ],{ allowDiskUse:true }).
                //collection.find({"time": {"$gte": fromdate }}).limit(100000).sort({"time":-1}).
                toArray(function(err, result){        
                    if(err){
                        res.send(err);
                    } else if(result.length){
                        console.log('have list ' + result.length);
                        downloadResult(result, format, res, filename, "WeatherStation", db, building);
                    } else{
                        console.log('no thing found -- ' );
                        res.send('nothing found');
                        db.close();
                    }
                });
            } else {
                var fromdate = new Date(req.body.Fromdate).getTime();
                collection.find({"ip": pi , "createdAt": {"$gte": fromdate }}).toArray(function(err, result){        
                    if(err){
                        res.send(err);
                    } else if(result.length){                       
                        downloadResult(result, format, res, filename, sensor, db, building);
                    } else{
                        res.send('no thing found');
                        db.close();
                    }
                })
            }
        }
    });
};

function downloadResult(result, format, res, filename, sensor, db, building){
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
            exel(res, sensor, result, db, building);           
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