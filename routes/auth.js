const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { check, body } = require('express-validator');
const { Editor } = require('../models/model');

router.get('/signup', authController.getSignup);
router.post('/signup',
    [body('firstName').isString().isLength({ min: 2 }).notEmpty().trim().toLowerCase().withMessage('نام باید فقط شامل حروف باشد.'),
    body('lastName').isString().isLength({ min: 2 }).notEmpty().trim().toLowerCase().withMessage('نام خانوادگی باید فقط شامل حروف باشد.'),
    body('phoneNumber').isNumeric().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/g).trim().withMessage('شماره موبایل معتبر وارد کنید.'),
    body('email').isEmail().notEmpty().trim().withMessage('ایمیل معتبر وارد کنید.'),
    body('password').isAlphanumeric().isLength({ min: 8 }).notEmpty().trim().withMessage('پسورد باید شامل حروف و عدد باشد و حداقل به طول 8 کاراکتر باشد.'),
    body('passwordConfirmed').trim().notEmpty().custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error("تکرار پسورد برابر نیست"); }
        return true;
    })], authController.postSignup);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);


module.exports = router;
