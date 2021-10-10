exports.getLogin = (req, res, next) => {
    res.json({ data: 'login page' });
};


exports.postLogin = (req, res, next) => {
    res.json({ data: 'post login req checkfor admin or editor' });
};