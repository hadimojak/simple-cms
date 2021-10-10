const express = require('express');
const router = express.Router();

router.get('/install', installController);
router.post('/isstall/[body]', installController);

