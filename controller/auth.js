const { validationResult } = require("express-validator");
const { User } = require("../models/Model");
const bcrypt = require("bcryptjs");
const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../sequelize");
const _ = require('lodash');


exports.getLogin = (req, res, next) => {

  res.render("auth/login", {
    pageTitle: "ورود",
    path: "/login",
    validationErrors: [],
    errorMessage: "",
    oldInput: "",
    isAuhtenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("auth/login", {
      pageTitle: "ورود",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        password: password,
        phoneNumber: phoneNumber,
      },
      validationErrors: errors.array(), isAuhtenticated: req.session.isLoggedIn
    });
  }
  User.findOne({ where: { phoneNumber: phoneNumber } })
    .then((editor) => {
      if (!editor) {
        res.render("auth/login", {
          pageTitle: "ورود",
          path: "/login",
          errorMessage: "some errors",
          oldInput: {
            password: password,
            phoneNumber: phoneNumber,
          },
          validationErrors: ["number", "password"], isAuhtenticated: req.session.isLoggedIn
        });
      } else {
        bcrypt.compare(password, editor.dataValues.password).then((doMatch) => {
          if (doMatch) {
            console.log('adadadasd')
            const allowed = ['id','email','phoneNumber',"isAdmin","state"];
            const filteredUser = _.pick(editor.dataValues, allowed)
            req.session.isLoggedIn = true;
            req.session.user = filteredUser;
            //saving session in to the db
            return req.session.save((err) => {
              
              res.redirect(`/admin`);
            });
          } else {
            res.render("auth/login", {
              pageTitle: "ورود",
              path: "/login",
              errorMessage: "some errors",
              oldInput: {
                password: password,
                phoneNumber: phoneNumber,
              },
              validationErrors: ["number", "password"], isAuhtenticated: req.session.isLoggedIn
            });
          }
        });
      }
    })
    .catch((err) => {
      if(err){console.log(err);
      res.redirect("/login");}
      
    });
};
exports.getReset = (req, res, next) => {
  res.json({ data: "password reset" });
};
exports.postReset = (req, res, next) => {
  res.json({ data: "password reset" });
};
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/admin');

  });
};
