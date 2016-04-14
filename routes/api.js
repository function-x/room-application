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
                    req.session.userId = user._id;
                    if (user.group == 'administrator') {
                        req.session.admin = true;
                    }
                    if (user.group == 'gatekeeper') {
                        req.session.gate = true;
                    }
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
    });
