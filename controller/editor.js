const fs = require('fs');
const path = require('path');
const pdf = require('pdf-thumbnail');
const gm = require('gm');
const { PDFNet } = require('@pdftron/pdfnet-node');

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


exports.postUpload = (req, res, next) => {
    const fileName = req.file.originalname;
    if (fileName.split('.')[1] === 'pdf') {
        PDFNet.initialize('demo:1634646868519:78bd88e90300000000a42b22ff1a99ac02686e42e084032143298c2e2f')
            .then(async data => {
                const posixFilePath = path.join(__dirname, '..', 'uploads', 'media', fileName).split(path.sep).join(path.posix.sep);
                const doc = await PDFNet.PDFDoc.createFromFilePath(posixFilePath);
                const thumb = await PDFNet.PDFDraw.create(90);
                const pg = await doc.getPage(1);
                await thumb.export(pg, path.join(__dirname, '..', 'uploads', 'thumb', `thumb_${fileName.split('.')[0]}.png`).split(path.sep).join(path.posix.sep), 'png');
                PDFNet.shutdown();
            });
    } else if (fileName.split('.')[1] === 'jpg')


        res.redirect('/editor/storage');
};
