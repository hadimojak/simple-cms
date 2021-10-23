const { User, Media } = require('../models/Model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const imageThumbnail = require('image-thumbnail');

// admin home page
exports.getAdminHomePage = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'مدیریت', path: '/admin' });
};
// admin users
exports.getUsers = (req, res, next) => {
    User.findAll({ paranoid: false }).
        then(data => {
            const userArray = [];
            for (let p of data) {
                userArray.push(p.dataValues);
            }
            return userArray;
        })
        .then(userArray => {
            res.render("admin/users",
                {
                    pageTitle: 'کاربر ها',
                    path: '/users',
                    userArray: userArray
                });
        })
        .catch(err => { console.log(err); });

};
exports.getAddUser = (req, res, next) => {
    res.render('admin/signup', {
        pageTitle: 'ثبت نام',
        path: '/signup',
        validationErrors: [],
        errorMessage: '', oldInput: '',
        selection: 'ثبت نام', update: false,
    });
};
exports.postAddUser = (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/signup',
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
exports.getUpdateUser = (req, res, next) => {
    const phoneNumber = req.params.userPhoneNumber;
    User.findAll({ where: { phoneNumber: phoneNumber } })
        .then(data => {
            res.render('admin/signup', {
                pageTitle: 'به روز رسانی کاربر',
                path: '/users',
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
exports.postUpdateUser = (req, res, next) => {
    const errors = validationResult(req);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const state = req.body.state === 'on' ? 1 : 0;
    if (!errors.isEmpty()) {
        return res.render('admin/signup',
            {
                pageTitle: 'به روز رسانی کاربر',
                path: '/users',
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
                    res.redirect('/admin/users');

                } catch (err) {
                    throw err;
                }

            }
            ).catch(err => {

            });

    }
};
exports.deleteUser = (req, res, next) => {
    const phoneNumber = req.params.userPhoneNumber;
    User.destroy({ where: { phoneNumber: phoneNumber } })
        .then(user => {
            res.json({ data: 'user deleted succesfully' });
        });
};

// admin files
exports.filesApi = (req, res, next) => {
    const fileArray = [];
    const definitelyPosix = path.join(__dirname, '..', 'uploads', 'media').split(path.sep).join(path.posix.sep);
    fs.readdir(definitelyPosix, (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.split('.')[1] === 'png' || file.split('.')[1] === 'jpg' || file.split('.')[1] === 'jpeg') {
                    fileArray.push({ src: `/uploads/media/${file}`, thumb: `/uploads/thumb/${file}`, fileName: file, ext: file.split('.')[1] });
                } else if (file.split('.')[1] === 'pdf') {
                    fileArray.push({ src: `/uploads/media/${file}`, thumb: `/pictures/pdf.png`, fileName: file, ext: file.split('.')[1] });
                } else if (file.split('.')[1] === 'rar' || file.split('.')[1] === 'zip') {
                    fileArray.push({ src: `/uploads/media/${file}`, thumb: `/pictures/file.png`, fileName: file, ext: file.split('.')[1] });
                } else if (file.split('.')[1] === 'mp4' || file.split('.')[1] === 'mkv') {
                    fileArray.push({ src: `/uploads/media/${file}`, thumb: `/pictures/video.png`, fileName: file, ext: file.split('.')[1] });
                }
            });
            res.json(fileArray);
        }
    });
};
exports.getAllFiles = (req, res, next) => {
    res.render('admin/allFiles', { pageTitle: 'فایل ها', path: '/storage' });
};
exports.postUploadFile = (req, res, next) => {
    console.log(req.file);
    const ext = path.extname(req.file.originalname);
    const options = { width: 128, height: 128 };
    if (ext === '.png' || ext === '.jpg' || ext === ".jpeg") {
        imageThumbnail(req.file.path, options)
            .then(thumbnail => {
                fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'thumb', req.file.filename), thumbnail);
            })
            .catch(err => { console.log(err); });
    }
    Media.create({
        fileName: req.file.filename, originalName: req.file.originalname,
        path: req.file.destination, mimetype: req.file.mimetype, size: req.file.size
    }).then(file => {
        res.redirect('/admin/storage');
    });
};
exports.deleteFile = (req, res, next) => {
    res.json({ data: 'deleteFile' });
};

// admin menus
exports.getMenus = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'منو ها', path: '/menu' });
};
exports.getAddMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};
exports.postAddMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};
exports.getEditMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};
exports.postEditMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};
exports.deleteMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};


//get admin settings
exports.getSettings = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'تنظیمات', path: '/setting' });
};

// admin posts
exports.getPosts = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'نوشته ها', path: '/post' });
};
exports.getAddPost = (req, res, next) => {
    res.render('admin/createPost', { pageTitle: 'نوشته جدید', path: '/post' });
};
exports.postAddPost = (req, res, next) => {
    const newPost = req.body.post;
    const postFileName = Date.now() + 'post' + ".html";
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'posts', postFileName)
        , newPost, (err) => { console.log(err); });
    res.redirect('/');


};
exports.getEditPost = (req, res, next) => { };
exports.postEditPost = (req, res, next) => { };
exports.deletePost = (req, res, next) => { };

// admin pages 
exports.getPages = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'صفحه ها', path: '/page' });
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
exports.getEditPage = (req, res, next) => {
    res.status(200).json({ data: 'get crate page' });
};
exports.postEditPage = (req, res, next) => {
    res.status(200).json({ data: 'get crate page' });
};
exports.deletePage = (req, res, next) => {
    res.status(200).json({ data: 'get crate page' });
};



