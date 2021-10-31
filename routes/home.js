const express = require('express');
const router = express.Router();
const homeController = require('../controller/home');

// router.get('/posts', endUserController);

// router.get('/post/[postId]', endUserController);

router.get('/',homeController.getHome);


module.exports = router;
