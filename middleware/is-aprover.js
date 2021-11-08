module.exports = (req, res, next) => {


    if (!req.session.user) {
        return res.redirect("/admin");
    } else if (!req.session.user.isAprover) {
        return res.redicert('/admin');
    }

    next();
};
