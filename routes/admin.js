const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { check, body } = require('express-validator');

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
    
router.get('/admin/editors/:editorPhoneNumber', adminController.getUpdateEditor);
router.post('/admin/editors/:editorPhoneNumber', [body('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام باید بدون فاصله  باشد').toLowerCase(),
body('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().escape().trim().custom(value => !/\s/.test(value))
    .withMessage('.نام خانوادگی باید بدون فاصله  باشد').toLowerCase(),
body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).escape().trim(),
body('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().escape().normalizeEmail(),
body('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().escape().trim(),
body('passwordConfirmed', ".تکرار پسورد برابر نیست").trim().notEmpty().escape().custom((value, { req }) => {
    if (value !== req.body.password) { throw new Error(); }
    return true;
})], adminController.postUpdateEditor);



router.post('/admin/deleteEditor', adminController.deleteEditor);
router.post('/admin/disableEditor', adminController.disableEditor);
router.post('/admin/enableEditor', adminController.enableEditor);

router.get('/admin/pages', adminController.getPages);
router.get('/admin/pages/pageName', adminController.getSinglePage);
router.post('/admin/pages/createPage', adminController.postCreatePage);
router.get('/admin/pages/createPage', adminController.getCreatePage);
router.get('/admin/pages/editmenu', adminController.getEditMenu);
router.post('/admin/pages/editmenu', adminController.postEditMenu);

router.get("/admin/storage", adminController.getMediaFilePage);
router.get("/admin/storage/fileName", adminController.filePreview);
router.post("/admin/storage/fileName/update", adminController.updateFile);
router.post("/admin/storage/fileName/delete", adminController.deleteFile);

module.exports = router;
