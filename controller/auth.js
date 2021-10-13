
const { validationResult } = require('express-validator');
const { Editor } = require('../models/model');
const bcrypt = require('bcryptjs');
const { ValidationError, Op } = require('sequelize');
const { sequelize } = require('../sequelize');


exports.getSignup = (req, res, next) => {
    res.render('signup', { pageTitle: 'ثبت نام', path: '/signup', validationErrors: [], errorMessage: '', oldInput: '' });
};
exports.postSignup = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('signup',
            {
                pageTitle: 'ثبت نام',
                path: '/signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                },
                validationErrors: errors.array(),
            });
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            return Editor.findAll({
                where: {
                    [Op.or]: [{ number: phoneNumber }, { email: email }]
                }
            }).then(data => {
                if (data.length !== 0) { throw data; }
                return data;
            }).then((editor) => {
                return Editor.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                    number: phoneNumber
                });
            }).then((result) => {
                res.redirect('/login');
            });
        }).catch(err => {
            res.render('signup', {
                pageTitle: 'ثبت نام',
                path: '/signup',
                errorMessage: '.شماره موبایل یا ایمیل قبلا استفاده شده است',
                oldInput: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                },
                validationErrors: ['email', 'number'],
            });
        });



};

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
    res.redirect(`/editor/${phoneNumber}`);

};

exports.logout = (req, res, next) => {
    res.json({ data: 'user logout' });
};