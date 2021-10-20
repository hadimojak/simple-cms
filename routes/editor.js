const express = require('express');
const router = express.Router();
const editorController = require('../controller/editor');
const path = require('path');
const multer = require('multer');
const { nextTick } = require("process");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/media');
    }, filename: function (req, file, cb) {
        cb(null, req.body.fileName + '.' + file.mimetype.split('/')[1]);
    }
});
exports.upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif'
            && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.zip'
            && ext !== '.rar' && ext !== ".mp4" && ext !== '.mpeg') {
            return callback(null, false);
        }
        callback(null, true);
    }, preservePath: true
}).single('file');




router.get('/editor/editorPhoneNumber', editorController.getEditorProfile);

router.get('/editor/editorPhoneNumber/posts', editorController.getAllPost);
router.get('/editor/editorPhoneNumber/addPost', editorController.getNewPost);
router.post('/editor/editorPhoneNumber/addPost', editorController.postNewPost);

router.post('/editor/editorPhoneNumber/deletePost', editorController.deletePost);
router.get('/editor/editorPhoneNumber/updatePost/[postId]', editorController.getEditPost);
router.post('/editor/editorPhoneNumber/updatePost/[postId]', editorController.postEditPost);

router.post('/editor/uploadFile', [multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif'
            && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.zip'
            && ext !== '.rar' && ext !== ".mp4" && ext !== '.mpeg') {
            return callback(null, false);
        }
        callback(null, true);
    }, preservePath: true
}).single('file'), function (req, res,callback) {
    if (!req.file) {
        res.redirect('/editor/storage');
    } else { callback(null, true); }
}], editorController.postUploadFile);
router.get("/editor/storage", editorController.getAllFiles);
router.get("/editor/storage/fileName", editorController.filePreview);
router.post("/editor/storage/fileName/update", editorController.updateFile);
router.post("/editor/storage/fileName/delete", editorController.deleteFile);

module.exports = router;
