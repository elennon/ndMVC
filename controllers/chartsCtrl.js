'use strict';
var monk = require('monk');
var db = monk('localhost:27017/Measurements');
const uuid = require('node-uuid');

exports.getCharts = (req, res, next) => {
    if (req.session.user == undefined ){
        res.render('home', {title: 'Home', readings : {}, moment: moment, user : null });
    } else{
        res.render('charts', {title: 'wind speed'});
    }
};