
const { validationResult } = require('express-validator');

exports.getSignup = (req, res, next) => {
    res.render('signup', { pageTitle: 'ثبت نام', path: '/signup', validationErrors: [], errorMessage: '' });
};
exports.postSignup = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('signup',
            {
                pageTitle: 'ثبت نام',
                path: '/signup',
                errorMessage: errors.array()[0].msg,
                // oldInput: {
                //     email: email,
                //     password: password,
                //     confirmPassword: req.body.confirmPassword,
                // },
                validationErrors: errors.array(),
            });
    }
    res.redirect("/login");
};

exports.getLogin = (req, res, next) => {
    res.render('login', { pageTitle: 'ورود', path: '/login' });
};

exports.postLogin = (req, res, next) => {
    res.json({ data: 'post login req checkfor admin or editor' });
};