// grant middleware
// need express-session
module.exports = {
    allowApplicant: function(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.json({
                code: 403,
                msg: 'not sign in yet',
                body: {}
            });
        }
    },
    allowAdministrator: function(req, res, next) {
        if (req.session.user && req.session.user.group == 'administrator') {
            next();
        } else {
            res.json({
                code: 403,
                msg: 'permission denied',
                body: {}
            });
        }
    },
    allowGateKeeper: function(req, res, next) {
        if (req.session.user && req.session.user.group == 'gatekeeper') {
            next();
        } else {
            res.json({
                code: 403,
                msg: 'permission denied',
                body: {}
            });
        }
    }
}