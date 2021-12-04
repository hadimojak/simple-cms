const { validationResult } = require("express-validator");
const { User } = require("../models/Model");
const bcrypt = require("bcryptjs");
const _ = require('lodash');


exports.getLogin = (req, res, next) => {
  if (!('user' in req.session)) {
    const isAdmin = false;
    const isAuhtenticated = false;
    res.render("auth/login", {
      pageTitle: "ورود",
      path: "/login",
      validationErrors: [],
      errorMessage: "",
      oldInput: "",
      isAuhtenticated: isAuhtenticated,
      isAdmin: isAdmin,
    });
  }

};

exports.postLogin = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (!('user' in req.session)) {
      const isAdmin = false;
      const isAuhtenticated = false;
      return res.render("auth/login", {
        pageTitle: "ورود",
        path: "/login",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          password: password,
          phoneNumber: phoneNumber,
        },
        validationErrors: ['phoneNumber', 'password'],
        isAuhtenticated: isAuhtenticated, isAdmin: isAdmin,
      });
    }

  }
  User.findOne({ where: { phoneNumber: phoneNumber } })
    .then((editor) => {
      if (!editor || !editor.dataValues.state) {
        return res.render("auth/login", {
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

      bcrypt.compare(password, editor.dataValues.password).then((doMatch) => {
        if (doMatch) {
          const allowed = ['id', 'email', 'phoneNumber', "isAdmin", "state", 'isAprover'];
          const filteredUser = _.pick(editor.dataValues, allowed);
          req.session.isLoggedIn = true;
          req.session.user = filteredUser;
          //saving session in to the db
          return req.session.save((err) => {

            res.redirect(`/admin`);
          });
        } else {
          if (!('user' in req.session)) {
            const isAdmin = false;
            const isAuhtenticated = false;
            res.render("auth/login", {
              pageTitle: "ورود",
              path: "/login",
              errorMessage: "some errors",
              oldInput: {
                password: password,
                phoneNumber: phoneNumber,
              },
              validationErrors: ["number", "password"], isAuhtenticated: isAuhtenticated, isAdmin: isAdmin,
            });
          }

        }
      });

    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      }

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
