const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');

router.get('/admin', adminController.getAdminHomePage);
router.get('/admin/editors', adminController.getEditors);
router.get('/admin/addEditor', adminController.getAddEditor);
router.post('/admin/addEditor', adminController.postAddEditor);
router.post('/admin/deleteEditor', adminController.deleteEditor);
router.post('/admin/disableEditor', adminController.disableEditor);
router.post('/admin/enableEditor', adminController.enableEditor);

router.get('/admin/pages', adminController.getPages);
router.get('/admin/pages/pageName', adminController.getSinglePage);
router.post('/admin/pages/createPage', adminController.postCreatePage);
router.get('/admin/pages/createPage', adminController.getCreatePage);
router.get('/admin/pages/editmenu', adminController.getEditMenu);
router.post('/admin/pages/editmenu', adminController.postEditMenu);

router.get("/admin/storage", adminController.getMediaFilePage);
router.get("/admin/storage/fileName", adminController.filePreview);
router.post("/admin/storage/fileName/update", adminController.updateFile);
router.post("/admin/storage/fileName/delete", adminController.deleteFile);

module.exports = router;
