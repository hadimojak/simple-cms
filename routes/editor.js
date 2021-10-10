const express = require('express');
const router = express.Router();

router.get('/[editorId]', editorController);

router.post('/[editorId]/addPost', editorController);
router.post('/[editorId]/deletePost', editorController);
router.post('/[editorId]/updatePost', editorController);


