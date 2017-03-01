var excelbuilder = require('msexcel-builder');
var excelObj = require("./excelObject.js");
var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');

function filterItems(query) {
    return objList.filter(function(el) {
        return el.createdAt === query;
    })
}

// //npm install msexcel-builder
var sensors = ['Bmp180', 'Hflux', 'CavityTemp', 'Mlx906', 'Sht15', 'sdp610' ];
var objList = [];

function addToList(facade, sensor, readings){
    switch(sensor){
        case 'Bmp180':
            readings.forEach(function(reading) {
                var present = filterItems(reading.createdAt);
                if(present.length > 0){
                    objList.push(present);
                } else {
                    var date = reading.createdAt.date;
                    var time = reading.createdAt.time;
                    var john = new excelObj(facade, sensor, reading.createdAt, date, time);
                }
            });
            break;
        case 'Hflux':
            //code block
            break;
        case 'Bmp180':
            //code block
            break;
        case 'Hflux':
            //code block
            break;
        case 'Bmp180':
            //code block
            break;
        case 'Hflux':
            //code block
            break;
    }
}

module.exports = function createWorkbook(building, fromdate, callback) {
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else {            
            var collection = db.collection('Pi');
            collection.find({"group": building }).toArray(function(err, result){        
                if(err){
                    return;
                } else if(result.length){
                    console.log('talt back' + result.length);
                    //foreach pi ...get list of reading per sensor
                    result.forEach(function(pi) {
                        sensors.forEach(function(sensor) {
                            getCollection(pi, sensor, fromdate, addToList)
                        });
                    });
                    db.close();
                } else{
                    return;
                }
            })
        }
    });
}

function getCollection(pi, sensor, fromdate, callback){
    MongoClient.connect(url, function(err, db){
        if(err){
            console.log('error:' + err);
        } else {            
            var collection = db.collection(sensor);
            collection.find({"ip": pi.id, "createdAt": {"$gte": fromdate }}).toArray(function(err, result){        
                if(err){
                    res.send(err);
                } else if(result.length){
                    callback(pi, sensor, result);
                    db.close();
                } else{
                    res.send('no thing found');
                    db.close();
                }
            })
        }
    });
}

// function getAllColl(type, callback){
//     MongoClient.connect(url, function(err, db){
//         if(err){
//             console.log('error:' + err);
//         } else {            
//             var collection = db.collection(sensor);
//             collection.find({"ip": pi , "createdAt": {"$gte": fromdate }}).toArray(function(err, result){        
//                 if(err){
//                     res.send(err);
//                 } else if(result.length){
//                     callback(result);
//                     db.close();
//                 } else{
//                     res.send('no thing found');
//                     db.close();
//                 }
//             })
//         }
//     });
// }

// function doExcel(list, callback){
//     // Create a new workbook file in current working-path
//     var workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')
//     // Create a new worksheet with 10 columns and 12 rows
//     var sheet1 = workbook.createSheet('sheet1', 10, 12);
//     // Fill some data
//     sheet1.set(1, 1, 'I am title');
//     for (var i = 2; i < 5; i++)
//         sheet1.set(i, 1, 'test'+i);
//     // Save it
//     workbook.save(function(err){
//         if (err)
//             throw err;
//         else
//             console.log('congratulations, your workbook created');
//     });
// }
