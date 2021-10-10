const express = require('express');
const router = express.Router();

router.get('/posts', endUserController);

router.get('/post/[postId]', endUserController);


