module.exports = (req, res, next) => {
  // console.log('login :',req.session.isLoggedIn?'true':'false')
  // console.log(req.session)
    if (!req.session.isLoggedIn) {
      return res.redirect("/login");
    }
  
    next();
  };
  