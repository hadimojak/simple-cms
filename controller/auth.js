
const { validationResult } = require('express-validator');
const { User } = require('../models/Model');
const bcrypt = require('bcryptjs');
const { ValidationError, Op } = require('sequelize');
const { sequelize } = require('../sequelize');




exports.getLogin = (req, res, next) => {
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
    User.findAll({ where: { phoneNumber: phoneNumber } })
        .then(editor => {
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
            bcrypt.compare(password, editor[0].dataValues.password)
                .then(doMatch => {
                    if (doMatch) {
                        return res.redirect(`/admin`);
                    }
                    return res.render('login', {
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