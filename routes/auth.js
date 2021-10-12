const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { check, body } = require('express-validator');
const { Editor } = require('../models/model');

router.get('/signup', authController.getSignup);
router.post('/signup',
    [body('firstName', '.نام باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().trim().toLowerCase(),
    body('lastName', '.نام خانوادگی باید فقط شامل حروف باشد').isString().isLength({ min: 2 }).notEmpty().trim().toLowerCase(),
    body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).trim(),
    body('email', '.ایمیل معتبر وارد کنید').isEmail().notEmpty().trim().normalizeEmail(),
    body('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().trim(),
    body('passwordConfirmed', ".تکرار پسورد برابر نیست").trim().notEmpty().custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error(); }
        return true;
    })],
    authController.postSignup);

router.get('/login', authController.getLogin);
router.post('/login',
    [body('phoneNumber', '.شماره موبایل معتبر وارد کنید').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).trim(),
    body('password', '.پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد').isAlphanumeric().isLength({ min: 8 }).notEmpty().trim()],
    authController.postLogin);

router.post('/logout', authController.logout);

module.exports = router;