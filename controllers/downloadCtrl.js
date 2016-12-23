var request = require('request');
var jsonfile = require('jsonfile');
var js2xmlparser = require("js2xmlparser");
var fs = require('fs');
var monk = require('monk');
var db = monk('localhost:27017/Measurements');

exports.getDownload = (req, res) => {
  res.render('download', {
    title: 'Download'
  });
};

exports.postDownload = (req, res) => {
    var fromdate = req.body.Fromdate;
	var todate = req.body.Todate
	var building = req.body.building
    var sensor = req.body.sensor 
	var format = req.body.format
    var collection = db.get(sensor);
    var  datj = new Date(fromdate);
    var  dat = new Date("Fri Jan 23 2015 21:18:51 GMT+0100 (CET)");
    var collection = db.get('Hflux');
    collection.find({createdAt: {$gt: dat}},  {}, function(err, docs) {
        noqs = JSON.parse(docs);
        //var noqs = body.replace(/\"/g, "")
        switch(format){
            case 'json':
                jsonfile.writeFile("tester.json", noqs, function (err) {
                    console.error(err);
                    res.download("tester.json");
                })	
                break;
            case 'xml':
                js2xmlparser.parse("readings", noqs);
                fs.writeFile('tester.xml', xml, function(err, data){
                    if (err) console.log(err);
                    console.log("successfully written our update xml to file");
                })
                break;
            }		
    })
    // req.flash('success', { msg: 'Email has been sent successfully!' });
    // res.redirect('/registerBuilding');
};
