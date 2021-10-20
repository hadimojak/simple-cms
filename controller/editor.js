const fs = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/media');
    }, filename: function (req, file, cb) {
        cb(null, req.body.fileName + '.' + file.mimetype.split('/')[1]);
    }
});
exports.upload = 


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
    const postFileName = Date.now() + 'post' + ".html";
    fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'posts', postFileName)
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
    const fileArray = [];
    const definitelyPosix = path.join(__dirname, '..', 'uploads', 'media').split(path.sep).join(path.posix.sep);
    fs.readdir(definitelyPosix, (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(async file => {
                if (file.split('.')[1] === 'pdf') {


                    // const definitelyPosix = path.join(__dirname, '..', 'uploads', 'media', file).split(path.sep).join(path.posix.sep);
                    // const pdfBuffer = fs.readFileSync(definitelyPosix);
                    // console.log(pdfBuffer);
                    // pdf(pdfBuffer, options).then(data => {
                    //     fs.writeFileSync(path.join(__dirname, '..', 'uploads', 'media', 'thumb_' + file)
                    //         , data, (err) => { console.log(err); });

                    // }).catch(err => { console.log(err); });
                }

            });
        }
        res.render('editor/allFiles', { pageTitle: 'فایل ها', path: '/storage' });

    });
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


exports.postUploadFile = (req, res, next) => {
    
    console.log(req.file);
    var ext = path.extname(req.file.originalname);
    console.log(ext);
    // if (fileName.split('.')[1] === 'mp4') {
    //     const tg = new ThumbnailGenerator({
    //         sourcePath: '../uploads/media/jjjj.mp4',
    //         thumbnailPath: '../uploads/thumb/',
    //     });
    //     tg.generate().then(console.log());
    // }


    res.redirect('/editor/storage');
};
