const { Editor } = require('../models/model');


exports.getAdminHomePage = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'مدیریت', path: '/admin' });
};
exports.getEditors = (req, res, next) => {
    Editor.findAll().
        then(data => {
            const EditorArray = [];
            for (let p of data) { EditorArray.push(p.dataValues); }
            return EditorArray;
        })
        .then(EditorArray => { res.render("admin/editors", { pageTitle: 'کاربر ها', path: '/editors', EditorArray: EditorArray }); })
        .catch(err => { console.log(err); });

};
exports.getAddEditor = (req, res, next) => {
    res.render("admin/admin", { pageTitle: 'کاربر ها', path: '/editors' });
};
exports.postAddEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor deleted' });
};
exports.deleteEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor deleted' });
};
exports.disableEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor disabled' });
};
exports.enableEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor enabled' });
};

exports.getPages = (req, res, next) => {
    res.status(200).json({ data: 'get all the pages' });
};

exports.getSinglePage = (req, res, next) => {
    res.status(200).json({ data: 'get single pages' });
};
exports.postCreatePage = (req, res, next) => {
    res.status(200).json({ data: 'crated page' });
};
exports.getCreatePage = (req, res, next) => {
    res.status(200).json({ data: 'get crate page' });
};

exports.getEditMenu = (req, res, next) => {
    res.json({ data: 'get edit menu' });
};


exports.postEditMenu = (req, res, next) => {
    res.json({ data: 'post edit menu' });
};

exports.getMediaFilePage = (req, res, next) => {
    res.json({ data: 'get inventory page' });
};
exports.filePreview = (req, res, next) => {
    res.json({ data: 'filePreview' });
};
exports.updateFile = (req, res, next) => {
    res.json({ data: 'updateFile' });
};
exports.deleteFile = (req, res, next) => {
    res.json({ data: 'deleteFile' });
};