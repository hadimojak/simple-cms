const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const { check, body } = require('express-validator');
const { User } = require('../models/model');

router.get('/', authController.getHome);

router.get('/login', authController.getLogin);
router.post('/login',
    [body('phoneNumber').isNumeric().escape().notEmpty().matches(/^(\+98|0098|98|0)?9\d{9}$/).trim(),
    body('password').isAlphanumeric().escape().isLength({ min: 8 }).notEmpty().trim()],
    authController.postLogin);

router.post('/logout', authController.logout);

module.exports = router;