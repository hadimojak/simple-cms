
const { validationResult } = require('express-validator');
const { User } = require('../models/Model');
const bcrypt = require('bcryptjs');
const { ValidationError, Op } = require('sequelize');
const { sequelize } = require('../sequelize');




exports.getLogin = (req, res, next) => {
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', { pageTitle: 'ورود', path: '/login', validationErrors: [], errorMessage: '', oldInput: '' });
};

exports.postLogin = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('auth/login', {
            pageTitle: 'ورود',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                password: password,
                phoneNumber: phoneNumber
            },
            validationErrors: errors.array(),
        });
    }
    User.findOne({ where: { phoneNumber: phoneNumber } })
        .then(editor => {
            console.log(editor.dataValues)
            if (editor.length === 0) {
                return res.render('auth/login', {
                    pageTitle: 'ورود',
                    path: '/login',
                    errorMessage: 'some errors',
                    oldInput: {
                        password: password,
                        phoneNumber: phoneNumber
                    },
                    validationErrors: ['number', 'password'],
                });

            }
            bcrypt.compare(password, editor.dataValues.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        // req.session.user = editor;
                        return res.redirect(`/admin`);
                    }
                    return res.render('auth/login', {
                        pageTitle: 'ورود',
                        path: '/login',
                        errorMessage: 'some errors',
                        oldInput: {
                            password: password,
                            phoneNumber: phoneNumber
                        },
                        validationErrors: ['number', 'password'],
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });

};
exports.getReset = (req, res, next) => {
    res.json({ data: 'password reset' });
};
exports.postReset = (req, res, next) => {
    res.json({ data: 'password reset' });
};
exports.logout = (req, res, next) => {
    res.json({ data: 'user logout' });
};