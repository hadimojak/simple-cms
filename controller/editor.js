exports.getEditorProfile = (req, res, next) => {
    res.json({ data: 'editor profile' });
};

exports.addPost = (req, res, next) => {
    res.json({ data: 'post added' });
};
exports.deletePost = (req, res, next) => {
    res.json({ data: 'post deleted' });
};
exports.getEditPost = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};
exports.updatePost = (req, res, next) => {
    res.json({ data: 'post updated' });
};
