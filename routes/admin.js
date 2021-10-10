const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');

router.get('/', adminController.getAdminPage);
router.post('/addEditor', adminController.addEditor);
router.post('/deleteEditor', adminController.deleteEditor);
router.post('/disableEditor', adminController.disableEditor);
router.post('/enableEditor', adminController.enableEditor);

router.get('/pages', adminController.getPages);
router.get('/pages/pageName', adminController.getSinglePage);
router.post('/pages/createPage', adminController.postCreatePage);
router.get('/pages/createPage', adminController.getCreatePage);
router.get('/pages/editmenu', adminController.getEditMenu);
router.post('/pages/editmenu', adminController.postEditMenu);

router.get("/storage", adminController.getMediaFilePage);
router.get("/storage/fileName", adminController.filePreview);
router.post("/storage/fileName/update", adminController.updateFile);
router.post("/storage/fileName/delete", adminController.deleteFile);

module.exports = router;
