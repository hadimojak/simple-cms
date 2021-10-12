exports.getEditorProfile = (req, res, next) => {
    const editorId = req.params.editorId;
    res.render('editor/editorHome',{pageTitle:'editor',path:'/editor'});
};

exports.getAddPost = (req, res, next) => {
    const editorId = req.params.editorId;

    res.json({ data: `get add posts ${editorId} ` });
};
exports.postAddPost = (req, res, next) => {
    const editorId = req.params.editorId;

    res.json({ data: `get add posts ${editorId} ` });
};
exports.deletePost = (req, res, next) => {
    res.json({ data: 'post deleted' });
};
exports.getEditPost = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};
exports.postEditPost = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};

