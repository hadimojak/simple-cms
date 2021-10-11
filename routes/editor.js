const express = require('express');
const router = express.Router();
const editorController = require('../controller/editor');

router.get('/editor/:editorId', editorController.getEditorProfile);
router.get('/editor/:editorId/addPost', editorController.getAddPost);
router.post('/editor/:editorId/addPost', editorController.postAddPost);
router.post('/editor/:editorId/deletePost', editorController.deletePost);
router.get('/editor/:editorId/updatePost/[postId]', editorController.getEditPost);
router.post('/editor/:editorId/updatePost/[postId]', editorController.postEditPost);


module.exports = router;
