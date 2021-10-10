const express = require('express');
const router = express.Router();

router.get('/login', authController);
router.post('/login', authController);

