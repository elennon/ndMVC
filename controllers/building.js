'use strict';

const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const graph = require('fbgraph');

exports.getBuilding = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};