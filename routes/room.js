var Room = require('../models/room');
var grant = require('./grant');
module.exports = require('express').Router()
    // new room
    .post('/', grant.allowAdministrator)
    .post('/', function(req, res, next) {
        new Room(req.body).save(function(err, room) {
            if (err) {
                console.log('new room error', err);
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
        })
    })
    // get rooms
    .get('/', function(req, res, next) {
        Room.find({}, function(err, rooms) {
            if (err) {
                console.log('get rooms error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                })
            } else {
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: rooms
                });
            }
        })
    })
    // update rooms
    .put('/:_id', grant.allowAdministrator)
    .put('/:_id', function(req, res, next) {
        Room.findByIdAndUpdate(req.params._id, { $set: req.body }, function(err, room) {
            if (err) {
                console.log('update room error', err);
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
        })
    })
    .delete('/:_id', grant.allowAdministrator)
    .delete('/:_id', function(req, res, next) {
        Room.remove({ _id: req.params._id }, function(err, room) {
            if (err) {
                console.log('delete room error', err);
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
        })
    })