var Application = require('../models/application');
var grant = require('./grant');
var Room = require('../models/room');

function getQuery(room, start, end, status) {
    return {
        room: room,
        status: status ? status : 'accepted',
        $or: [
            {
                startTime: {
                    $gte: start,
                    $lte: end
                }
            },
            {
                endTime: {
                    $gte: start,
                    $lte: end
                }
            }
        ]
    };
}

module.exports = require('express').Router()
    // view applications
    .get('/', function(req, res, next) {
        var room = req.query.room;
        var start = req.query.start;
        var end = req.query.end;
        var status = req.query.status;
        if (!start || !end) {
            // get applications in 24 hours
            start = Date.now();
            end = start + 86400000;
        }
        query = getQuery(room, start, end, status);
        Application.find(query, function(err, applications) {
            if (err) {
                console.log('find applications error', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                applications.forEach(function(v) { v.passport = null });
                res.json({
                    code: 0,
                    msg: 'ok',
                    body: applications
                });
            }
        });
    })
    // add application
    .post('/', grant.allowApplicant) // allow applicant
    .post('/', function(req, res, next) {
        if (req.body.end - req.body.start >= 0) { // minimum time
            Application.find(getQuery(req.body.room, req.body.start, req.body.end), function(err, applications) {
                if (err) {
                    console.log('find applications error', err);
                    res.json({
                        code: -1,
                        msg: 'err',
                        body: {}
                    });
                } else if (applications.length == 0) {
                    new Application({
                        title: req.body.title,
                        description: req.body.description,
                        applicant: req.session.userId,
                        room: req.body.room,
                        startTime: req.body.start,
                        endTime: req.body.end,
                    }).save(function(err, application) {
                        if (err) {
                            console.log('save applications error', err);
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
                } else {
                    applications.forEach(function(v) { v.passport = null })
                    res.json({
                        code: 1,
                        msg: 'busy',
                        body: applications
                    });
                }
            });
        } else {
            res.json({
                code: 2,
                msg: 'time too short',
                body: {}
            });
        }
    })
    .get('/:_id', function(req, res, next) {
        Application.findById(req.params._id, function(err, application) {
            if (err) {
                console.log('get application err', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                // only the applicant and the gatekeeper can view the passport
                if (req.session.user) {
                    if (req.session.user.group == 'gatekeeper') {
                        Room.findById(application.room, function(err, room) {
                            if (err) {
                                console.log('gatekeeper check room err', err);
                                res.json({
                                    code: -1,
                                    msg: 'err',
                                    body: {}
                                });
                            } else {
                                if (room.gatekeeper != req.session.user._id) {
                                    application.passport = null;
                                }
                                res.json({
                                    code: 0,
                                    msg: 'ok',
                                    body: application
                                });
                            }
                        })
                    } else {
                        if (req.session.user._id != application.applicant) {
                            application.passport = null;
                        }
                        res.json({
                            code: 0,
                            msg: 'ok',
                            body: application
                        });
                    }
                } else {
                    application.passport = null;
                    res.json({
                        code: 0,
                        msg: 'ok',
                        body: application
                    });
                }
            }
        });
    })
    // only the administrator can update the application's status
    .put('/:_id', grant.allowAdministrator)
    .put('/:_id', function(req, res, next) {
        var status = req.body.status;
        if (status == 'accepted') {
            // 6 digits random integer string
            req.body.passport = ('000000' + ~~(Math.random() * 1000000)).slice(-6);
            // failed others conflict applications
            Application.findAndUpdate(getQuery(application.room, application.startTime, application.endTime), {
                $set: {
                    status: 'failed',
                    passport: null
                }
            }, function(err, application) {
                if (err) {
                    console.log('failed other applications err', err);
                    res.json({
                        code: -1,
                        msg: 'err',
                        body: {}
                    })
                } else {
                    // and then accept the application
                    next();
                }
            })
        } else {
            req.body.passport = null;
            next();
        }
    })
    .put('/:_id', function(req, res, next) {
        var status = req.body.status;
        var passport = req.body.passport;
        Application.findByIdAndUpdate(req.params._id, {
            $set: {
                status: status,
                passport: passport,
            }
        }, function(err, application) {
            if (err) {
                console.log('update application err', err);
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
    .delete('/:_id', grant.allowAdministrator)
    .delete('/:_id', function(req, res, next) {
        Application.remove({ _id: req.params._id }, function(err, application) {
            if (err) {
                console.log('delete application err', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                res.json({
                    code: 0,
                    msg: '',
                    body: application
                });
            }
        })
    })