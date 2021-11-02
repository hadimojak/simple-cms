const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { check, body } = require('express-validator');
const path = require('path');
const multer = require('multer');
const { Media } = require('../models/Model');
const isAuth = require('../middleware/is-auth');
const isIp = require('../middleware/is-ip');

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



// users
router.get('/admin', isAuth, adminController.getAdminHomePage);
router.get('/admin/users', isAuth, adminController.getUsers);
router.get('/admin/addUser', isAuth, adminController.getAddUser);
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
    })], isAuth,
    adminController.postAddUser);
router.get('/admin/updateUser/:userId', isAuth, adminController.getUpdateUser);
router.post('/admin/updateUser', [body('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
body('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
body('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail()
], isAuth, adminController.postUpdateUser);
router.delete('/admin/delete/user/:id', isAuth, adminController.deleteUser);

// if(user is normalUser show her only her files)
router.get("/admin/storage", isAuth, adminController.getAllFiles);
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
}], isAuth, adminController.postUploadFile);
router.get('/admin/storage/fileData', isAuth, adminController.filesApi);
router.delete("/admin/delete/storage/:fileName", isAuth, adminController.deleteFile);

//if(user is super User show her menus )
router.get('/admin/menus', isAuth, adminController.getMenus);
router.get('/admin/menuData', isAuth, adminController.menuApi);
router.post('/admin/addMenu', isAuth, adminController.postAddMenu);
router.get('/admin/updateMenu/:menuId', isAuth, adminController.getEditMenu);
router.post('/admin/updateMenu', isAuth, adminController.postEditMenu);
router.delete('/admin/delete/page/:menuId', isAuth, adminController.deleteMenu);

//if user is super user
router.get('/admin/settings', isAuth, adminController.getSettings);

// if(user is normal user show het only her posts)
router.get('/admin/posts', isAuth, adminController.getPosts);
router.get('/admin/postData', isAuth, adminController.postsApi);
router.post('/admin/posts/aprovePost/:postName', isAuth, adminController.aprovePost);
router.post('/admin/posts/deAprovePost/:postName', isAuth, adminController.deAprovePost);
router.get('/admin/addPost', isAuth, adminController.getAddPost);
router.post('/admin/addPost', isAuth, adminController.postAddPost);
router.get('/admin/updatePost/:postName', isAuth, adminController.getEditPost);
router.delete('/admin/delete/post/:postName', isAuth, adminController.deletePost);


// if(user is superUser show her the pages routes)
router.get('/admin/pages', isAuth, adminController.getPages);
router.get('/admin/pages/:pageId', isAuth, adminController.getSinglePage);
router.post('/admin/createPage', isAuth, adminController.postCreatePage);
router.get('/admin/createPage', isAuth, adminController.getCreatePage);
router.get('/admin/updatePage/:pageId', isAuth, adminController.getEditPage);
router.post('/admin/updatePage', isAuth, adminController.postEditPage);
router.delete('/admin/delete/page/:pageId', isAuth, adminController.deletePage);





module.exports = router;
