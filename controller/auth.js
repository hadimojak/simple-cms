
const { validationResult } = require('express-validator');
const { Editor } = require('../models/model');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
    res.render('signup', { pageTitle: 'ثبت نام', path: '/signup', validationErrors: [], errorMessage: '', oldInput: '' });
};
exports.postSignup = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    console.log(phoneNumber,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    const password = req.body.password;
    const errors = validationResult(req);
    // console.log(errors.array());
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
    Editor.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        number: phoneNumber
    })
        .then(result => {
            res.redirect("/login");
        }).catch(err => { console.log(err); });
};

exports.getLogin = (req, res, next) => {
    res.render('login', { pageTitle: 'ورود', path: '/login', validationErrors: [], errorMessage: '', oldInput: '' });
};

exports.postLogin = (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const errors = validationResult(req);
    // console.log(errors);
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