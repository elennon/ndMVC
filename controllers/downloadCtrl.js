var request = require('request');
var jsonfile = require('jsonfile');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var util = require('util');
var json2xls = require('json2xls');
var MongoClient = require('mongodb').MongoClient

exports.getDownload = (req, res) => {
  res.render('download', {
    title: 'Download'
  });
};

exports.postDownload = (req, res) => {
    var fromdate = new Date(req.body.Fromdate);
	var todate = new Date(req.body.Todate);
	var building = req.body.building;
    var pi = req.body.pi;
    var sensor = req.body.sensor;
	var format = req.body.format;
    //let filename = util.format('%s-%s-%s-%s-%s', building, pi, sensor, fromdate, todate)
    let filename = "data";
    MongoClient.connect("mongodb://localhost:27017/Measurements", function(err, db){
        if(err){
            console.log('error:' + err);
        } else{            
            var collection = db.collection('Hflux');
            collection.find({ "createdAt": { $gt: dat } }).toArray(function(err, result){
                if(err){
                    res.send(err);
                } else if(result.length){
                    console.log('and the number is ********' + result.length)
                    switch(format){
                        case 'json':
                            jsonfile.writeFile(filename + ".json", result, {flags:'w'}, function (err) {
                                res.download("tester.json");
                            })	
                            break;
                        case 'xml':
                            var xml = js2xmlparser.parse(sensor, JSON.stringify(result));
                            fs.writeFile(filename + '.xml', xml, {flags:'w'}, function(err, data){
                                if (err) console.log(err);
                                console.log("successfully written our update xml to file");
                                res.download("tester.xml");
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
                } else{
                    res.send('no thing found');
                }
            })
        }
        db.close();
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