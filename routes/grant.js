// grant middleware
// need express-session
module.exports = {
    allowApplicant: function(req, res, next) {
        if (req.session.userId) {
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
        if (req.session.userId && req.session.admin) {
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
        if (req.session.userId && req.session.gate) {
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