var User = require('../models/user');
module.exports = require('express').Router()
    .post('/signup', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        if (username && password) {
            new User({
                username: username,
                password: password,
                group: 'applicant'
            }).save(function(err, user) {
                if (err) {
                    console.log(err);
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
            res.json({
                code: 1,
                msg: 'argument error',
                body: {}
            });
        }
    })
    .post('/signin', function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne({
            username: username,
        }, function(err, user) {
            if (err) {
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else if (user) {
                if (user.password == password) {
                    // auth successed
                    req.session.userId = user;
                    res.json({
                        code: 0,
                        msg: 'ok',
                        body: {}
                    });
                } else {
                    res.json({
                        code: 1,
                        msg: 'wrong username or password',
                        body: {}
                    });
                }
            } else {
                res.json({
                    code: 2,
                    msg: 'user not exist',
                    body: {}
                });
            }
        });
    })
    .get('/signout', function(req, res, next) {
        req.session.destroy(function(err) {
            if (err) {
                console.log('error in sign out', err);
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
    // when there is no administrator, create one
    .post('/init', function(req, res, next) {
        User.find({
            group: 'administrator',
        }, function(err, users) {
            if (err) {
                console.log('init failed', err);
                res.json({
                    code: -1,
                    msg: 'err',
                    body: {}
                });
            } else {
                if (users.length == 0) {
                    next(); // has no admin
                } else {
                    res.json({
                        code: 1,
                        msg: 'has admin',
                        body: {}
                    });
                }
            }
        });
    })
    .post('/init', function(req, res, next) {
        new User({
            username: req.body.username,
            password: req.body.password,
            group: 'administrator'
        }).save(function(err, user) {
            if (err) {
                console.log('create admin failed', err);
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
