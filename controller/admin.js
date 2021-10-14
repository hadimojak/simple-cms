const { Editor } = require('../models/model');
const { ValidationError, Op } = require('sequelize');
const { validationResult } = require('express-validator');



exports.getAdminHomePage = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'مدیریت', path: '/admin' });
};
exports.getEditors = (req, res, next) => {
    Editor.findAll().
        then(data => {
            const EditorArray = [];
            for (let p of data) { EditorArray.push(p.dataValues); }
            return EditorArray;
        })
        .then(EditorArray => { res.render("admin/editors", { pageTitle: 'کاربر ها', path: '/editors', EditorArray: EditorArray }); })
        .catch(err => { console.log(err); });

};
exports.getAddEditor = (req, res, next) => {
    res.render('signup', { pageTitle: 'ثبت نام', path: '/signup', validationErrors: [], errorMessage: '', oldInput: '', selection: 'ثبت نام', update: false });
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
                validationErrors: errors.array(), selection: 'ثبت نام', update: false
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
                validationErrors: ['email', 'number'], selection: 'ثبت نام', update: false
            });
        });



};
exports.getUpdateEditor = (req, res, next) => {
    const phoneNumber = req.params.editorPhoneNumber;
    Editor.findAll({ where: { number: phoneNumber } })
        .then(data => {
            res.render('signup', {
                pageTitle: 'به روز رسانی کاربر',
                path: '/signup',
                errorMessage: '',
                oldInput: {
                    email: data[0].dataValues.email,
                    password: data[0].dataValues.password,
                    passwordConfirmed:data[0].dataValues.password,
                    firstName: data[0].dataValues.firstName,
                    lastName: data[0].dataValues.lastName,
                    phoneNumber: data[0].dataValues.number
                },
                validationErrors: [],
                selection: 'به روز رسانی', update: true
            });
        })
        .catch(err => { console.log(err); });


};
exports.postUpdateEditor = (req, res, next) => {
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
                validationErrors: errors.array(), selection: 'به روز رسانی', update: true
            });
    }
    res.json({ data: 'editor updated' });
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