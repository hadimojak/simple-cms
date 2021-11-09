const { User, Media, Post, Menu, Tag, Category } = require("../models/Model");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const imageThumbnail = require("image-thumbnail");
const { Op } = require('../sequelize');


// admin home page
exports.getAdminHomePage = (req, res, next) => {
  const userId = req.session.user.id;
  User.findByPk(userId).then(user => {
    res.render("admin/admin", {
      pageTitle: "مدیریت", path: "/admin", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id,
      isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
    });
  });

};

// admin users
exports.getUsers = (req, res, next) => {
  const userId = req.session.user.id;
  User.findByPk(userId).then(user => {
    User.findAll()
      .then((data) => {
        const userArray = [];
        for (let p of data) {
          userArray.push(p.dataValues);
        }
        return userArray;
      })
      .then((userArray) => {
        res.render("admin/users", {
          pageTitle: "کاربر ها",
          path: "/users",
          userArray: userArray, isAuhtenticated: req.session.isLoggedIn, currrentUser: req.session.user.phoneNumber, userId: req.session.user.id, isAdmin: req.session.user.isAdmin
          , userId: req.session.user.id, avatar: user.dataValues.avatar
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

};
exports.getPassReset = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId).then(user => {
    res.render('admin/passwordReset', {
      pageTitle: 'تغییر پسورد',
      path: '/passReset', validationErrors: [],
      errorMessage: '', oldInput: '',
      isAuhtenticated: req.session.isLoggedIn,
      userId: req.session.user.id,
      isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar
    });
  });

};
exports.postPassReset = (req, res, next) => {
  const userId = req.session.user.id;
  const errors = validationResult(req);
  const currentPassword = req.body.currentPassword;
  const password = req.body.password;
  let avatar;
  User.findByPk(req.session.user.id).then(user => {
    avatar = user.dataValues.avatar;
    return user;
  }).then(user => {
    bcrypt.compare(currentPassword, user.dataValues.password).then(doMatch => {
      console.log(doMatch);
      if (!doMatch) {
        console.log(doMatch);
        //some flash message
        return res.render("admin/passwordReset", {
          pageTitle: "تغییر پسورد",
          path: "/passReset",
          errorMessage: 'پس ورد فعلی درست ورا دنکرده اید',
          oldInput: {
          },
          validationErrors: ['password'],
          isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
        });
      } else {
        if (!errors.isEmpty()) {
          return res.render("admin/passwordReset", {
            pageTitle: "تغییر پسورد",
            path: "/passReset",
            errorMessage: errors.array()[0].msg,
            oldInput: {
            },
            validationErrors: errors.array(),
            isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
          });
        } else {
          bcrypt
            .hash(password, 12)
            .then(async (hashedPassword) => {
              console.log('heeerrrreeee');
              try {
                await User.update({
                  password: hashedPassword,
                }, { where: { id: userId } }).then();
              } catch (err) {
                throw err;
              }
              res.redirect(307, '/logout');
            })
            .catch((err) => {
              res.render("admin/passwordReset", {
                pageTitle: "تغییر پسورد",
                path: "/passReset",
                errorMessage: '',
                oldInput: {
                },
                validationErrors: [],
                isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: avatar
              });
            });
        }
      }
    });
  });




};
exports.getAddUser = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    res.render("admin/signup", {
      pageTitle: "ثبت نام",
      path: "/signup",
      validationErrors: [],
      errorMessage: "",
      oldInput: "",
      selection: "ثبت نام",
      update: false, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
    });

  });

};
exports.postAddUser = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const errors = validationResult(req);
  User.findByPk(req.session.user.id).then(user => {
    if (!errors.isEmpty()) {
      return res.render("admin/signup", {
        pageTitle: "ثبت نام",
        path: "/signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        },
        validationErrors: errors.array(),
        selection: "ثبت نام",
        update: false, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
      });
    }
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        try {
          await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
          });
        } catch (err) {
          throw err;
        }
        res.redirect("/admin/users");
      })
      .catch((err) => {
        const unique = err.errors[0].path.split(".")[1];
        res.render("admin/signup", {
          pageTitle: "ثبت نام",
          path: "/signup",
          errorMessage:
            unique === "email" ? "ایمیل" : "شماره موبایل" + " تکراری می باشد",
          oldInput: {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
          },
          validationErrors: [unique],
          selection: "ثبت نام",
          update: false, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
        });
      });

  });

};
exports.getUserProfile = (req, res, next) => {
  const userId = req.params.userId;
  User.findOne({ where: { id: userId } })
    .then((data) => {
      res.render("admin/signup", {
        pageTitle: "به روز رسانی کاربر",
        path: "/users",
        errorMessage: "",
        oldInput: {
          email: data.dataValues.email,
          firstName: data.dataValues.firstName,
          lastName: data.dataValues.lastName,
          phoneNumber: data.dataValues.phoneNumber,
        },
        validationErrors: [],
        selection: "به روز رسانی",
        update: true, isAuhtenticated: req.session.isLoggedIn, isAdmin: req.session.user.isAdmin, userId: userId, avatar: data.dataValues.avatar
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postUpdateUser = (req, res, next) => {
  const errors = validationResult(req);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const id = req.body.userId;
  const state = req.body.state === "on" ? 1 : 0;
  const isAprover = req.body.isAprover === 'on' ? 1 : 0;
  User.findByPk(id).then(user => {
    if (!errors.isEmpty()) {
      return res.render("admin/signup", {
        pageTitle: "به روز رسانی کاربر",
        path: "/users",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        },
        validationErrors: errors.array(),
        selection: "به روز رسانی",
        update: true, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
      });
    } else {
      User.update(
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          state: state, isAprover: isAprover,
          phoneNumber: phoneNumber
        },
        { where: { id: id } }
      ).then(data => {
        if (req.session.user.isAdmin) {
          res.redirect("/admin/users");
        } else { res.redirect(`/admin/userProfile/${req.session.user.id}`); }
      }).catch(err => { console.log(err); });
    }
  });
};
exports.getUpdateAvatar = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    res.render('admin/updateAvatar', {
      pageTitle: "به روز رسانی کاربر",
      path: "",
      errorMessage: "",
      validationErrors: [],
      selection: "به روز رسانی",
      update: true, isAuhtenticated: req.session.isLoggedIn, isAdmin: req.session.user.isAdmin, userId: req.session.user.id, avatar: user.dataValues.avatar
    });

  });

};
exports.postUpdateAvatar = (req, res, next) => {
  const userId = req.body.userId;
  const avatarBaseCode = req.body.imageBase;
  User.update({ avatar: avatarBaseCode }, { where: { id: userId } })
    .then(user => { res.redirect('/admin'); });


};
exports.deleteUser = (req, res, next) => {
  const id = req.params.id;

  User.findOne({ where: { id: id } })
    .then(user => {
      if (user.dataValues.isAdmin === true) {
        // req.flash("error", "you nact delete admin acount");
        return res.redirect('/admin/users');
      } else {
        User.destroy({ where: { id: id } })
          .then((user) => {
            res.json({ data: user + " user deleted succesfully" });
          });
      }
    }
    ).catch((err) => {
      console.log(err);
    });

};

// admin files
exports.filesApi = (req, res, next) => {
  const fileArray = [];
  Media.findAll()
    .then((files) => {
      return files.forEach((file) => {
        fileArray.push(file.dataValues);
      });
    })
    .then((data) => {
      res.json(fileArray);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAllFiles = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    res.render("admin/allFiles", {
      pageTitle: "فایل ها", path: "/storage", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar, isAprover: req.session.user.isAprover
    });


  });
};
exports.postUploadFile = (req, res, next) => {
  const userId = req.session.user.id;
  const ext = path.extname(req.file.originalname);
  const options = { width: 128, height: 128 };
  let thumbLoc;
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".Jpeg") {
    imageThumbnail(req.file.path, options)
      .then((thumbnail) => {
        fs.writeFileSync(
          path.join(__dirname, "..", "uploads", "thumb", req.file.filename),
          thumbnail
        );
      })
      .catch((err) => {
        console.log(err);
      });
    thumbLoc = `/uploads/thumb/${req.file.filename}`;
  }
  if (ext === ".pdf") {
    thumbLoc = "/pictures/pdf.png";
  }
  if (ext === ".rar" || ext === ".zip") {
    thumbLoc = "/pictures/file.png";
  }
  if (ext === ".mp4" || ext === ".mkv" || ext === ".3gp") {
    thumbLoc = "/pictures/video.png";
  }
  Media.create({
    fileName: req.file.filename.split(".")[0],
    originalName: req.file.originalname,
    thumb: thumbLoc,
    path: req.file.destination.split(".")[1] + `/${req.file.filename}`,
    mimetype: req.file.mimetype,
    ext: ext,
    size: req.file.size / 1000,
    UserId: userId,
  }).then((file) => {
    res.redirect("/admin/storage");
  });
};
exports.deleteFile = (req, res, next) => {
  const fileName = req.params.fileName;
  //delete files from storage
  Media.findOne({ where: { fileName: fileName } })
    .then((file) => {
      fs.unlinkSync(
        path.join(__dirname, "..", file.dataValues.path),
        function (err) {
          if (err) return console.log(err);
        }
      );
      if (
        file.dataValues.ext === ".jpg" ||
        file.dataValues.ext === ".png" ||
        file.dataValues.ext === ".jpeg" ||
        file.dataValues.ext === ".Jpeg"
      ) {
        fs.unlinkSync(
          path.join(__dirname, "..", file.dataValues.thumb),
          function (err) {
            if (err) return console.log(err);
          }
        );
      }
      //delete files drom dataBase
    })
    .catch((err) => console.log(err));
  Media.destroy({ where: { fileName: fileName } }).then((file) => {
    return res.json({ data: file + " is deleted" });
  });
};

// admin menus
exports.getMenus = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {

    res.render("admin/allMenu", {
      pageTitle: "منو ها", path: "/menu", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar
    });

  });
};
exports.menuApi = (req, res, next) => {
  const menuArray = [];
  Menu.findAll({}).then(menus => {
    return menus.forEach(menu => {
      menuArray.push(menu.dataValues);
    });
  }).then(data => { res.json(menuArray); }).catch(err => { console.log(err); });
};
exports.postAddMenu = (req, res, next) => {
  const userId = req.session.user.id;
  const title = req.body.title;
  const navArray = JSON.stringify(req.body.navArray);
  Menu.create({ title: title, navItemArray: navArray, UserId: userId }).then(data => {
    res.json({ data: 'done' });
  });


};
exports.getEditMenu = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    const menuId = req.params.menuId;
    Menu.findOne({ where: { id: menuId } }).then(data => {
      res.render('admin/updateMenu', {
        pageTitle: "منو ها", path: "/menu", menuId: menuId, menu: data.dataValues, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id,
        isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
      });
    });

  });

};
exports.postEditMenu = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const navArray = JSON.stringify(req.body.navArray);
  Menu.update({ navItemArray: navArray, title: title }, { where: { id: id } }).then(data => {
    res.json({ data: 'done' });
  });
};
exports.deleteMenu = (req, res, next) => {

  //not functional
  res.json({ data: "post edit menu" });
};

//get admin settings
exports.getSettings = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {

    res.render("admin/admin", {
      pageTitle: "تنظیمات", path: "/setting", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar
    });

  });
};

// admin posts
exports.postsApi = (req, res, next) => {

  const postArray = [];
  Post.findAll()
    .then((posts) => {
      return posts.forEach((post) => {
        postArray.push(post.dataValues);
      });
    })
    .then((data) => {
      res.json(postArray);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getPosts = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {

    res.render("admin/allPosts", {
      pageTitle: "نوشته ها", path: "/post", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar, isAprover: req.session.user.isAprover
    });

  });
};
exports.getAddPost = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    res.render("admin/updatePost", {
      pageTitle: "نوشته جدید",
      path: "/post",
      update: false,
      oldInput: "", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
    });

  });

};
exports.postAddPost = (req, res, next) => {
  const tags = req.body.tags.split(',');
  console.log(tags);
  console.log(req.body);
  const userId = req.session.user.id;
  const title = req.body.title;
  if (title.trim() === "") {
    //falsg m,essage
    return res.json({ error: "no content name" });
  } else {
    const deltaContent = req.body.deltaContent;
    const htmlContent = req.body.htmlContent;
    const postTitle = title + ".html";
    Post.findOne({ where: { path: req.body.postPath } }).then((post) => {
      if (post && req.body.postPath === '') {
        //flash message
        return res.json({ error: "allready exxict" });
      } else {
        if (req.body.postPath) {
          fs.unlinkSync(
            path.join(__dirname, "..", req.body.postPath),
            function (err) {
              if (err) return console.log(err);
            }
          );
          Post.update({
            postName: title, deltaContent: deltaContent, UserId: userId, path: "/uploads/posts/" + postTitle, tags: tags,CategoryTitle :req.body.category
          }
            , { where: { path: req.body.postPath } })
            .then(post => {
              fs.writeFileSync(
                path.join(__dirname, "..", "uploads", "posts", postTitle),
                htmlContent,
                (err) => {
                  console.log(err);
                }
              );
              tags.forEach(p => { Tag.create({ title: p }).then(data => { }).catch(err => { console.log(err); }); });
              res.redirect("/admin/posts");
            });
        } else {
          Post.create({
            postName: title, deltaContent: deltaContent,
            path: "/uploads/posts/" + postTitle,
            UserId: userId, tags: tags
          })
            .then((post) => {
              fs.writeFileSync(
                path.join(__dirname, "..", "uploads", "posts", postTitle),
                htmlContent,
                (err) => {
                  console.log(err);
                }
              );
              res.redirect("/admin/posts");
            })
            .catch((err) => {
              console.log(err);
              if (err) {
              }
            });
        }
      }
    });
  }
};
exports.getEditPost = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {

    const postName = req.params.postName;
    Post.findOne({ where: { postName: postName } })
      .then((post) => {
        const postPath = post.dataValues.path;
        res.render("admin/updatePost", {
          pageTitle: "ویرایش",
          path: "/post",
          update: true,
          oldInput: {
            title: postName, postPath: postPath
          }, isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin, avatar: user.dataValues.avatar
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

};
exports.deletePost = (req, res, next) => {
  const postName = req.params.postName;
  //delete files from storage
  Post.findOne({ where: { postName: postName } })
    .then((post) => {
      fs.unlinkSync(
        path.join(__dirname, "..", post.dataValues.path),
        function (err) {
          if (err) return console.log(err);
        }
      );
      //delete post from database
    })
    .catch((err) => console.log(err));
  Post.destroy({ where: { postName: postName } }).then((post) => {
    return res.json({ data: post + " is deleted" });
  });
};
exports.aprovePost = (req, res, next) => {
  const postName = req.params.postName;
  Post.update({ aproved: true }, { where: { postName: postName } }).then(post => { res.redirect("/admin/posts"); });
};
exports.deAprovePost = (req, res, next) => {
  const postName = req.params.postName;
  Post.update({ aproved: false }, { where: { postName: postName } }).then(post => { res.redirect("/admin/posts"); });
};

//category
exports.apiCategory = (req, res, next) => {
  let cats = [];
  Category.findAll({})
    .then(data => {
      return data.forEach(p => {
        cats.push(p.dataValues);
      });
    })
    .then(data => { res.json(cats); }).catch(err => { console.log(err); });
};
exports.getCategory = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {
    console.log(req.session.user.isAprover)
    res.render('admin/category', {
      path: '', pageTitle: 'دسته ها',
      isAuhtenticated: req.session.isLoggedIn,
      isAdmin: req.session.user.isAdmin,
      isAprover: req.session.user.isAprover, avatar: user.dataValues.avatar, userId: req.session.user.id
    });
  });
};
exports.postAddCategory = (req, res, next) => {
  Category.create({ title: req.body.category }).then(data => {
    res.json({ data: 'categury created' });
  }).catch(err => { console.log(err); });
};
exports.getEditCategory = (req, res, next) => { };
exports.postEditCategory = (req, res, next) => { };
exports.deleteCategory = (req, res, next) => {
  const catTitle = req.params.catTitle;
  Category.destroy({ where: { title: catTitle } }).then(category => {
    return res.json({ data: catTitle + 'is deleted' });
  });
};


// admin pages
exports.getPages = (req, res, next) => {
  User.findByPk(req.session.user.id).then(user => {

    res.render("admin/pages", {
      pageTitle: "صفحه ها", path: "/page", isAuhtenticated: req.session.isLoggedIn, userId: req.session.user.id, isAdmin: req.session.user.isAdmin,
      avatar: user.dataValues.avatar
    });

  });
};
exports.getSinglePage = (req, res, next) => {
  res.status(200).json({ data: "get single pages" });
};
exports.postCreatePage = (req, res, next) => {
  res.status(200).json({ data: "crated page" });
};
exports.getCreatePage = (req, res, next) => {
  res.status(200).json({ data: "get crate page" });
};
exports.getEditPage = (req, res, next) => {
  res.status(200).json({ data: "get crate page" });
};
exports.postEditPage = (req, res, next) => {
  res.status(200).json({ data: "get crate page" });
};
exports.deletePage = (req, res, next) => {
  res.status(200).json({ data: "get crate page" });
};
