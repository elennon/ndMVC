'use strict';
var monk = require('monk');
var db = monk('localhost:27017/Measurements');
const uuid = require('node-uuid');

exports.getCharts = (req, res, next) => {
    res.render('charts', {
        title: 'wind speed'
    });
};
