const express = require('express');
const router = express.Router();
const editorController = require('../controller/editor');

router.get('/[editorId]', editorController.getEditorProfile);
router.post('/[editorId]/addPost', editorController.addPost);
router.post('/[editorId]/deletePost', editorController.deletePost);
router.get('/[editorId]/updatePost/[postId]', editorController.getEditPost);
router.post('/[editorId]/updatePost/[postId]', editorController.updatePost);


module.exports = router;
