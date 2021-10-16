const { User } = require('../models/Model');
const { ValidationError, Op, where } = require('sequelize');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');




exports.getAdminHomePage = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'مدیریت', path: '/admin' });
};



exports.getAddEditor = (req, res, next) => {
    res.render('signup', {
        pageTitle: 'ثبت نام',
        path: '/signup',
        validationErrors: [],
        errorMessage: '', oldInput: '',
        selection: 'ثبت نام', update: false,
    });
};

exports.postAddEditor = (req, res, next) => {
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
                selection: 'ثبت نام',
                update: false
            });
    }

    bcrypt
        .hash(password, 12)
        .then(async hashedPassword => {
            try {
                await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                    phoneNumber: phoneNumber
                });
            } catch (err) {
                throw err;
            }
            res.redirect('/login');
        }).catch(err => {
            console.log(err.errors[0].path.split('.')[1]);
            const unique = err.errors[0].path.split('.')[1];
            res.render('signup', {
                pageTitle: 'ثبت نام',
                path: '/signup',
                errorMessage: (unique === 'email') ? 'ایمیل' : 'شماره موبایل' + ' تکراری می باشد',
                oldInput: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                },
                validationErrors: [unique],
                selection: 'ثبت نام',
                update: false
            });
        });
};

exports.getEditors = (req, res, next) => {
    User.findAll().
        then(data => {
            const editorArray = [];
            for (let p of data) { editorArray.push(p.dataValues); }
            return editorArray;
        })
        .then(editorArray => {
            res.render("admin/editors",
                {
                    pageTitle: 'کاربر ها',
                    path: '/editors',
                    editorArray: editorArray
                });
        })
        .catch(err => { console.log(err); });

};

exports.getUpdateEditor = (req, res, next) => {
    const phoneNumber = req.params.editorPhoneNumber;
    User.findAll({ where: { phoneNumber: phoneNumber } })
        .then(data => {
            res.render('signup', {
                pageTitle: 'به روز رسانی کاربر',
                path: '/editors',
                errorMessage: '',
                oldInput: {
                    email: data[0].dataValues.email,
                    password: data[0].dataValues.password,
                    firstName: data[0].dataValues.firstName,
                    lastName: data[0].dataValues.lastName,
                    phoneNumber: phoneNumber
                },
                validationErrors: [],
                selection: 'به روز رسانی',
                update: true
            });
        })
        .catch(err => { console.log(err); });
};


exports.postUpdateEditor = (req, res, next) => {
    const errors = validationResult(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const state = req.body.state === 'on' ? 1 : 0;
    console.log(state, 'lllllllllllllll', phoneNumber);
    if (!errors.isEmpty()) {
        return res.render('signup',
            {
                pageTitle: 'به روز رسانی کاربر',
                path: '/editors',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                },
                validationErrors: errors.array(),
                selection: 'به روز رسانی',
                update: true
            });
    } else {
        bcrypt
            .hash(password, 12)
            .then(async (hashedPassword) => {
                try {
                    await User.update({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: hashedPassword,
                        phoneNumber: phoneNumber,
                        state: state
                    }, { where: { phoneNumber: phoneNumber } });
                    res.redirect('/admin/editors');

                } catch (err) {
                    throw err;
                }

            }
            ).catch(err => {

            });

    }
};

exports.deleteEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor deleted' });
};
exports.disableEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor disabled' });
};
exports.enableEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor enabled' });
};

exports.getPages = (req, res, next) => {
    res.status(200).json({ data: 'get all the pages' });
};

exports.getSinglePage = (req, res, next) => {
    res.status(200).json({ data: 'get single pages' });
};
exports.postCreatePage = (req, res, next) => {
    res.status(200).json({ data: 'crated page' });
};
exports.getCreatePage = (req, res, next) => {
    res.status(200).json({ data: 'get crate page' });
};

exports.getEditMenu = (req, res, next) => {
    res.json({ data: 'get edit menu' });
};


exports.postEditMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};

exports.getMediaFilePage = (req, res, next) => {
    res.json({ data: 'get inventory page' });
};
exports.filePreview = (req, res, next) => {
    res.json({ data: 'filePreview' });
};
exports.updateFile = (req, res, next) => {
    res.json({ data: 'updateFile' });
};
exports.deleteFile = (req, res, next) => {
    res.json({ data: 'deleteFile' });
};