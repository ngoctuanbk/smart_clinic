/* eslint-disable no-param-reassign */
const isEmpty = require('is-empty');
const passport = require('passport');

module.exports = {
    index: async (req, res) => {  // eslint-disable-line
        if (req.isAuthenticated()) {
            return res.redirect('/admin');
        }
        res.render('login/index', {
            layout: 'login',
            title: ':: SmartClinic website | All for a smart clinic  ::',
        });
    },
    login: async (req, res, next) => {
        try {
            passport.authenticate('local', (err, user) => { // eslint-disable-line
                if (err) {
                    return res.status(400).json({err});
                }
                if (!user) {
                    return res.json({Success: false, Message: 'Tài khoản hoặc mật khẩu không đúng!'});
                }
                req.logIn(user, (err) => { // eslint-disable-line
                    if (err) {
                        return next(err);
                    }
                    return res.json({Success: true});
                });
            })(req, res, next);
        } catch (err) {
            res.status(500).json({Success: false, Message: err});
        }
    },
    logout: async (req, res) => { // eslint-disable-line
        try {
            req.logout();
            res.redirect('/');
        } catch (error) {
            return res.json(error);
        }
    },
    getSession: async (req, res) => {
        if (!isEmpty(req.session.passport.user)) {
            res.json(req.session.passport.user);
        } else {
            res.json({});
        }
    },
};
