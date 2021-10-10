exports.getAdminPage = (req, res, next) => {
    res.render("admin");
};
exports.addEditor = (req, res, next) => {
    res.status(200).json({ data: 'editor created' });
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