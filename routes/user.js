var User = require('../models/user');
var grant = require('./grant');
module.exports = require('express').Router()
    // view all users
    // .get('/', grant.allowAdministrator)
    .get('/', function(req, res, next) {
        User.find({}, function(err, users) {
            if (err) {
                console.log('view user error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: users //todo : hide password
                });
            }
        })
    })
    // view 
    .get('/:_id', function(req, res, next) {
        User.findById(req.params._id, function(err, user) {
            if (err) {
                console.log('view user error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: user //todo : hide password
                });
            }
        });
    })
    // change user profile
    .put('/:_id', function(req, res, next) {
        User.findByIdAndUpdate(req.params._id, { $set: req.body }, function(err, user) {
            if (err) {
                console.log('update user error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: {}
                });
            }
        });
    })
    // remove user
    .delete('/:_id', function(req, res, next) {
        User.remove({ _id: req.params._id }, function(err, user) {
            if (err) {
                console.log('remove user error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: {}
                });
            }
        });
    })