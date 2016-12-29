'use strict';
var monk = require('monk');
var db = monk('localhost:27017/Measurements');
const uuid = require('node-uuid');

exports.getBuilding = (req, res) => {
    res.render('registerBuilding', {
        title: 'register Building'
    });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postBuilding = (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('location', 'location is not valid').notEmpty();
    req.assert('description', 'description cannot be blank').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/registerBuilding');
    }
    var collection = db.get('Building');
    let newId = uuid.v4();
    collection.insert({
        id: newId,
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        createdAt : Date.now()
    }, function(err, sensor){
        if (err) throw err;
        req.flash('success', { msg: 'The building has been registered successfully! The new id is:' + newId });
        res.redirect('/registerBuilding');
    });    
};
