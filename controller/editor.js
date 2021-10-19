const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const fs = require('fs');
const path = require('path');


exports.getEditorProfile = (req, res, next) => {
    res.render('editor/editorHome', { pageTitle: 'editor', path: '/editor' });
};

exports.getNewPost = (req, res, next) => {
    res.render('createPost', { pageTitle: 'نوشته جدید', path: '/editor' });
    // res.json({ data: `get add posts ${editorId} ` });
};
exports.postNewPost = async (req, res, next) => {
    // const editorId = req.params.editorId;
    // console.log(req.body.post);
    const newPost = req.body.post;
    const postFielName = Date.now() + 'post' + ".html";
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'posts', postFielName)
        , newPost, (err) => { console.log(err); });


    res.redirect('/');
    // const element = document.createElement('body');
    // element = s;

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

exports.getAllFiles = (req, res, next) => {
    const imagesArray = [];
    const images = fs.readdirSync(path.join(__dirname, '..', 'uploads', 'media'),
        { encoding: 'utf8' });
    images.forEach(p => {
        imagesArray.push('/uploads/media/' + p);
    });

    res.render('editor/allFiles', { pageTitle: 'فایل ها', path: '/storage', imageUrl: imagesArray, imageName: images });

};

exports.filePreview = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};
exports.updateFile = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};
exports.deleteFile = (req, res, next) => {
    res.json({ data: 'getign post update from' });
};


exports.postUpload = (req, res, next) => {
    console.log(req.body, req.file);
    res.redirect('/editor/storage')
};
