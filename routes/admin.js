const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { check, body } = require('express-validator');
const path = require('path');
const multer = require('multer');
const { Media } = require('../models/Model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/media');
    }, filename: function (req, file, cb) {
        if (file.mimetype === 'application/octet-stream') {
            return cb(null, req.body.fileName + '.rar');
        }
        if (file.mimetype === 'application/x-zip-compressed') {
            return cb(null, req.body.fileName + '.zip');
        }
        cb(null, req.body.fileName + '.' + file.mimetype.split('/')[1]);
    }
});



// if(user is superUser show her the users routes)
router.get('/admin', adminController.getAdminHomePage);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/addUser', adminController.getAddUser);
router.post('/admin/addUser',
    [body('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
        .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
    body('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
        .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
    body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
    body('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail(),
    body('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().escape().trim(),
    body('passwordConfirmed', ".تکرار پسورد برابر نیست").trim().notEmpty().escape().custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error(); }
        return true;
    })],
    adminController.postAddUser);
router.get('/admin/updateUser/:userPhoneNumber', adminController.getUpdateUser);
router.post('/admin/updateUser', [body('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
body('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
body('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail()
], adminController.postUpdateUser);
router.delete('/admin/delete/user/:userPhoneNumber', adminController.deleteUser);

// if(user is normalUser show her only her files)
router.get("/admin/storage", adminController.getAllFiles);
router.post('/admin/uploadFile', [multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
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
router.get('/admin/storage/fileData', adminController.filesApi);
router.delete("/admin/delete/storage/:fileName", adminController.deleteFile);

//if(user is super User show her menus )
router.get('/admin/menus', adminController.getMenus);
router.get('/admin/menuData', adminController.menuApi);
router.post('/admin/addMenu', adminController.postAddMenu);
router.get('/admin/updateMenu/:menuId', adminController.getEditMenu);
router.post('/admin/updateMenu', adminController.postEditMenu);
router.delete('/admin/delete/page/:menuId', adminController.deleteMenu);

//if user is super user
router.get('/admin/settings', adminController.getSettings);

// if(user is normal user show het only her posts)
router.get('/admin/posts', adminController.getPosts);
router.get('/admin/postData', adminController.postsApi);
router.post('/admin/posts/aprovePost/:postName', adminController.aprovePost);
router.post('/admin/posts/deAprovePost/:postName', adminController.deAprovePost);
router.get('/admin/addPost', adminController.getAddPost);
router.post('/admin/addPost', adminController.postAddPost);
router.get('/admin/updatePost/:postName', adminController.getEditPost);
router.delete('/admin/delete/post/:postName', adminController.deletePost);


// if(user is superUser show her the pages routes)
router.get('/admin/pages', adminController.getPages);
router.get('/admin/pages/:pageId', adminController.getSinglePage);
router.post('/admin/createPage', adminController.postCreatePage);
router.get('/admin/createPage', adminController.getCreatePage);
router.get('/admin/updatePage/:pageId', adminController.getEditPage);
router.post('/admin/updatePage', adminController.postEditPage);
router.delete('/admin/delete/page/:pageId', adminController.deletePage);





module.exports = router;
