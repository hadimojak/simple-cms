module.exports = (req, res, next) => {
    // console.log('login :',req.session.isLoggedIn?'true':'false')
    // console.log(req.session)
      if (!req.session.user.isAdmin) {
        return res.redirect("/admin");
      }
    
      next();
    };
    