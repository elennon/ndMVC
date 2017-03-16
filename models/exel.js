var excelbuilder = require('msexcel-builder');
var excelObj = require("./excelObject.js");
var MongoClient = require('mongodb').MongoClient
let url = 'mongodb://localhost:27017/Measurements';
var moment = require('moment');
var json2xls = require('json2xls');
var fs = require('fs');
var jsonfile = require('jsonfile');


module.exports = function createWorkbook(res, sensor, result, db) {
    res.attachment('file.xls');
    let c = "";
    switch(sensor){
        case 'Mlx906':
            c +="sensor"+"\t"+" time"+"\t"+"ambiTemp"+"\t"+"skyTemp"+"\n";
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].sensor + "\t" + moment(result.createdAt).format("YYYY-MM-DD HH:mm") 
                + "\t" + result[i].ambiTemp + "\t" + result[i].skyTemp + "\n";
            }
            break;
        case 'Bmp180':
            c +="sensor"+"\t"+" time"+"\t"+"temp(ºC)"+"\t"+"pressure(Pascal)"+"\n";
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].sensor + "\t" + moment(result.createdAt).format("YYYY-MM-DD HH:mm")  
                + "\t" + result[i].temp + "\t" + result[i].pressure + "\n";
            }
            break;
        case 'Sht15':
            c +="sensor"+"\t"+" time"+"\t"+"temp"+"\t"+"RH%"+"\n";
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].sensor + "\t" + moment(result.createdAt).format("YYYY-MM-DD HH:mm")  
                + "\t" + result[i].temperature + "\t" + result[i].rh + "\n";
            }
            break;
        case 'Hflux':
            c +="sensor"+"\t" + " time" + "\t" + "value(W/m²)" + "\n";
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].sensor + "\t" + moment(result.createdAt).format("YYYY-MM-DD HH:mm")  
                + "\t" + result[i].val + "\n";
            }
            break;
        case 'WeatherStation':
            c +=" corrected_direction"+"\t" + " time" + "\t" + " wind_speed(m/s)" + "\t" +
                " temp(ºC)" + "\t" + " pressure(Pascal)" + "\t" + " precipitation(mm)"+ "\t" +
                " RH%" + "\n";
            console.log('******* case WeatherStation');
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].corrected_direction + "\t" + moment(result[i].time).format("YYYY-MM-DD HH:mm") + "\t" +
                    result[i].wind_speed + "\t" + result[i].temp + "\t" + result[i].pressure + "\t" + result[i].precipitation + "\t" + 
                    result[i]['rh%'] + "\n";
            }
            console.log('******* case after 4');
            break;
        default:
            c +="sensor"+"\t" + " time" + "\t" + "value" + "\n";
            for (var i = 0; i < result.length; i++) {                       
                c += result[i].sensor + "\t" + moment(result.createdAt).format("YYYY-MM-DD HH:mm")  
                + "\t" + result[i].val + "\n";
            }
            break;
    }
    db.close();
    return res.send(c);
}
