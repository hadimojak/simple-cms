exports.getEditorProfile = (req, res, next) => {
    const editorId = req.params.editorId;
    res.render('editor/editorHome', { pageTitle: 'editor', path: '/editor' });
};

exports.getNewPost = (req, res, next) => {
    res.render('createPost', { pageTitle: 'نوشته جدید', path: '/editor' });
    // res.json({ data: `get add posts ${editorId} ` });
};
exports.postNewPost = (req, res, next) => {
    // const editorId = req.params.editorId;
    console.log(req.body);

    res.json({ data: `get add posts ${editorId} ` });
};
exports.getAllPost = (req, res, next) => {
    res.json({ data: 'post deleted' });
}; exports.deletePost = (req, res, next) => {
    res.json({ data: 'post deleted' });
};
exports.getEditPost = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};
exports.postEditPost = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};

