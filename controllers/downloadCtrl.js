var request = require('request');
var jsonfile = require('jsonfile');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var util = require('util');
var json2xls = require('json2xls');
var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');

exports.getDownload = (req, res) => {
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
                    res.render('download', {title: 'Download', buildings : buildings, 
                        pies : result});
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
            collection.find().toArray(function(err, result){
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

exports.postDownload = (req, res) => {
    var fromdate = new Date(req.body.Fromdate).getTime();
	var todate = new Date(req.body.Todate).getTime();
	var building = req.body.dl_building;
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
              collection.find({"ip": pi , "createdAt": {"$gte": fromdate }}).toArray(function(err, result){        
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********   in download post' + result.length);
                    switch(format){
                        case 'json':
                            jsonfile.writeFile(filename + ".json", result, {flags:'w'}, function (err) {
                                res.download("data.json");
                            })	
                            break;
                        case 'xml':
                            var xml = js2xmlparser.parse(sensor, JSON.stringify(result));
                            fs.writeFile(filename + '.xml', xml, {flags:'w'}, function(err, data){
                                if (err) console.log(err);
                                console.log("successfully written our update xml to file");
                                res.download("data.xml");
                            })
                            break;
                        case 'excel':
                            var xls = json2xls(result);
                            fs.writeFile(filename + '.xlsx', xls, 'binary', function(err, data){
                                if (err) console.log(err);
                                console.log("successfully written our update xml to file");
                                res.download(filename + '.xlsx');
                            })
                            break;
                    } 
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
    });
    // req.flash('success', { msg: 'Email has been sent successfully!' });
    // res.redirect('/registerBuilding');
};
// var cursor =db.collection('Hflux').find( { "createdAt": { $gt: dat } } );
            // cursor.each(function(err, doc) {                
            //     if (doc != null) {
            //         console.log('***************************************')
            //         console.dir(doc);
            //     }
            // });
