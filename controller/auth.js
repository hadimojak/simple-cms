
const { validationResult } = require('express-validator');
const { User } = require('../models/Model');
const bcrypt = require('bcryptjs');
const { ValidationError, Op } = require('sequelize');
const { sequelize } = require('../sequelize');




exports.getLogin = (req, res, next) => {
    res.render('login', { pageTitle: 'ورود', path: '/login', validationErrors: [], errorMessage: '', oldInput: '' });
};

exports.postLogin = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', {
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
    User.findAll({ where: { number: phoneNumber } })
        .then(editor => {
            if (editor.length === 0) {
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

            }
            bcrypt.compare(password, editor[0].dataValues.password)
                .then(doMatch => {
                    if (doMatch) {
                        return res.redirect(`/editor/${phoneNumber}`);
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

exports.logout = (req, res, next) => {
    res.json({ data: 'user logout' });
};