const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { check, body } = require('express-validator');
const path = require('path');
const multer = require('multer');
const { Media } = require('../models/Model');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const isIp = require('../middleware/is-ip');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/media');
    }, filename: function (req, file, cb) {
        let fileName = req.body.fileName;
        if (!req.body.fileName) { fileName = Date.now(); }
        if (file.mimetype === 'application/octet-stream') {
            return cb(null, fileName + '.rar');
        }
        if (file.mimetype === 'application/x-zip-compressed') {
            return cb(null, fileName + '.zip');
        }
        cb(null, fileName + '.' + file.mimetype.split('/')[1]);
    }
});

// users
router.get('/admin', isAuth, adminController.getAdminHomePage);
router.get('/admin/resetPassword/:userId', isAuth, adminController.getPassReset);
router.post('/admin/resetPassword',
    [check('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().escape().trim(),
    check('passwordConfirmed', ".تکرار پسورد برابر نیست").trim().notEmpty().escape().custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error(); }
        return true;
    })],
    isAuth, adminController.postPassReset);
router.get('/admin/users', isAdmin, isAuth, adminController.getUsers);
router.get('/admin/addUser', isAdmin, isAuth, adminController.getAddUser);
router.post('/admin/addUser', isAdmin, isAuth,
    [check('firstName', '.نام باید فقط شامل حروف باشد').isAlpha('fa-IR', { ignore: '\s' }).isLength({ min: 2 }).notEmpty().escape().trim()
        .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
    check('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isAlpha('fa-IR', { ignore: '\s' }).isLength({ min: 2 }).notEmpty().escape().trim()
        .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
    check('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
    check('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail(),
    check('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().escape().trim(),
    check('passwordConfirmed', ".تکرار پسورد برابر نیست").trim().notEmpty().escape().custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error(); }
        return true;
    })],
    adminController.postAddUser);
router.get('/admin/userProfile/:userId', isAuth, adminController.getUserProfile);
router.post('/admin/updateUser',
    [check('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
        .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
    check('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
        .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
    check('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
    check('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail(),
    ]
    , isAuth, adminController.postUpdateUser);
router.get('/admin/updateAvatar/:userId', isAuth, adminController.getUpdateAvatar);
router.post('/admin/updateAvatar', isAuth, adminController.postUpdateAvatar);
router.delete('/admin/delete/user/:id', isAdmin, isAuth, adminController.deleteUser);

// file
router.get("/admin/storage", isAuth, adminController.getAllFiles);
router.post('/admin/uploadFile', isAuth, [multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (!req.body.fileName) { return callback(null, true); }
        Media.findOne({ where: { fileName: req.body.fileName } })
            .then(data => {
                if (data) {
                    return callback(null, false);
                } else {
                    var ext = path.extname(file.originalname);
                    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif'
                        && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.zip'
                        && ext !== '.rar' && ext !== ".mp4" && ext !== '.mpeg' && ext !== '.Jpeg') {
                        return callback(null, false);
                    }
                    callback(null, true);
                }
            })
            .catch(err => { console.log(err); });
    }, preservePath: true
}).single('file'), function (req, res, callback) {
    if (!req.file) {
        res.redirect('/admin/storage');
    } else { callback(null, true); }
}], adminController.postUploadFile);
router.get('/admin/storage/fileData', isAuth, adminController.filesApi);
router.delete("/admin/delete/storage/:fileName", isAdmin, isAuth, adminController.deleteFile);

//menu
router.get('/admin/menus', isAdmin, isAuth, adminController.getMenus);
router.get('/admin/menuData', isAdmin, isAuth, adminController.menuApi);
router.post('/admin/addMenu', isAdmin, isAuth, adminController.postAddMenu);
router.get('/admin/updateMenu/:menuId', isAdmin, isAuth, adminController.getEditMenu);
router.post('/admin/updateMenu', isAdmin, isAuth, adminController.postEditMenu);
router.delete('/admin/delete/page/:menuId', isAdmin, isAuth, adminController.deleteMenu);

//setting
router.get('/admin/settings', isAdmin, isAuth, adminController.getSettings);
router.post('/admin/settings', isAdmin, isAuth, adminController.postSettings);

//post
router.get('/admin/posts', isAuth, adminController.getPosts);
router.get('/admin/postData', isAuth, adminController.postsApi);
router.post('/admin/posts/aprovePost/:postName', isAuth, adminController.aprovePost);
router.post('/admin/posts/deAprovePost/:postName', isAuth, adminController.deAprovePost);
router.get('/admin/addPost', isAuth, adminController.getAddPost);
router.post('/admin/addPost', isAuth, adminController.postAddPost);
router.get('/admin/updatePost/:postId', isAuth, adminController.getEditPost);
router.delete('/admin/delete/post/:postName', isAdmin, isAuth, adminController.deletePost);

//category
router.get('/admin/categoryData', isAuth, adminController.apiCategory);
router.get('/admin/addCategory', isAuth, adminController.getCategory);
router.post('/admin/addCategory', isAuth, adminController.postAddCategory);
router.get('/admin/updateCategory/:categoryId', isAuth, adminController.getEditCategory);
router.post('/admin/updateCategory', isAuth, adminController.postEditCategory);
router.delete('/admin/deleteCategory/:categoryId', isAuth, adminController.deleteCategory);

// page
router.get('/admin/pages', isAuth, adminController.getPages);
router.get('/admin/pages/:pageId', isAuth, adminController.getSinglePage);
router.post('/admin/createPage', isAuth, adminController.postCreatePage);
router.get('/admin/createPage', isAuth, adminController.getCreatePage);
router.get('/admin/updatePage/:pageId', isAuth, adminController.getEditPage);
router.post('/admin/updatePage', isAuth, adminController.postEditPage);
router.delete('/admin/delete/page/:pageId', isAuth, adminController.deletePage);





module.exports = router;
