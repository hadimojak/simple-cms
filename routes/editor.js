const express = require('express');
const router = express.Router();
const editorController = require('../controller/editor');

router.get('/editor/:editorPhoneNumber', editorController.getEditorProfile);

router.get('/editor/editorPhoneNumber/posts', editorController.getAllPost);
router.get('/editor/editorPhoneNumber/addPost', editorController.getNewPost);
router.post('/editor/editorPhoneNumber/addPost', editorController.postNewPost);

router.post('/editor/editorPhoneNumber/deletePost', editorController.deletePost);
router.get('/editor/editorPhoneNumber/updatePost/[postId]', editorController.getEditPost);
router.post('/editor/editorPhoneNumber/updatePost/[postId]', editorController.postEditPost);


module.exports = router;
