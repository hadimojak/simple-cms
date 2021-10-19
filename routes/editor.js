const express = require('express');
const router = express.Router();
const editorController = require('../controller/editor');
const { upload } = require('../app');

router.get('/editor/editorPhoneNumber', editorController.getEditorProfile);

router.get('/editor/editorPhoneNumber/posts', editorController.getAllPost);
router.get('/editor/editorPhoneNumber/addPost', editorController.getNewPost);
router.post('/editor/editorPhoneNumber/addPost', editorController.postNewPost);

router.post('/editor/editorPhoneNumber/deletePost', editorController.deletePost);
router.get('/editor/editorPhoneNumber/updatePost/[postId]', editorController.getEditPost);
router.post('/editor/editorPhoneNumber/updatePost/[postId]', editorController.postEditPost);

router.post('/editor/uploadFile', upload.single('file'),editorController.postUpload);
router.get("/editor/storage", editorController.getAllFiles);
router.get("/editor/storage/fileName", editorController.filePreview);
router.post("/editor/storage/fileName/update", editorController.updateFile);
router.post("/editor/storage/fileName/delete", editorController.deleteFile);

module.exports = router;
