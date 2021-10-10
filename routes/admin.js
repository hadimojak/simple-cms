const express = require('express');
const router = express.Router();

router.get('/', adminController);

router.post('/addEditor', adminController);

router.post('/deleteEditor', adminController);
router.post('/disableEditor', adminController);
router.post('/enableEditor', adminController);