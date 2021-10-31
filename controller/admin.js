const { User, Media, Post, Menu } = require("../models/Model");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const imageThumbnail = require("image-thumbnail");
const { Op } = require('../sequelize');

// admin home page
exports.getAdminHomePage = (req, res, next) => {
  res.render("admin/admin", { pageTitle: "مدیریت", path: "/admin" });
};

// admin users
exports.getUsers = (req, res, next) => {
  User.findAll({ paranoid: false })
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
        userArray: userArray,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAddUser = (req, res, next) => {
  res.render("admin/signup", {
    pageTitle: "ثبت نام",
    path: "/signup",
    validationErrors: [],
    errorMessage: "",
    oldInput: "",
    selection: "ثبت نام",
    update: false,
  });
};
exports.postAddUser = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const errors = validationResult(req);
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
      update: false,
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
      res.redirect("/login");
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
        update: false,
      });
    });
};
exports.getUpdateUser = (req, res, next) => {
  const phoneNumber = req.params.userPhoneNumber;
  User.findAll({ where: { phoneNumber: phoneNumber } })
    .then((data) => {
      res.render("admin/signup", {
        pageTitle: "به روز رسانی کاربر",
        path: "/users",
        errorMessage: "",
        oldInput: {
          email: data[0].dataValues.email,
          password: data[0].dataValues.password,
          firstName: data[0].dataValues.firstName,
          lastName: data[0].dataValues.lastName,
          phoneNumber: phoneNumber,
        },
        validationErrors: [],
        selection: "به روز رسانی",
        update: true,
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
  const password = req.body.password;
  const state = req.body.state === "on" ? 1 : 0;
  if (!errors.isEmpty()) {
    return res.render("admin/signup", {
      pageTitle: "به روز رسانی کاربر",
      path: "/users",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      },
      validationErrors: errors.array(),
      selection: "به روز رسانی",
      update: true,
    });
  } else {
    bcrypt
      .hash(password, 12)
      .then(async (hashedPassword) => {
        try {
          await User.update(
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hashedPassword,
              phoneNumber: phoneNumber,
              state: state,
            },
            { where: { phoneNumber: phoneNumber } }
          );
          res.redirect("/admin/users");
        } catch (err) {
          throw err;
        }
      })
      .catch((err) => { });
  }
};
exports.deleteUser = (req, res, next) => {
  const phoneNumber = req.params.userPhoneNumber;
  User.destroy({ where: { phoneNumber: phoneNumber } })
    .then((user) => {
      res.json({ data: user + " user deleted succesfully" });
    })
    .catch((err) => {
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
  res.render("admin/allFiles", { pageTitle: "فایل ها", path: "/storage" });
};
exports.postUploadFile = (req, res, next) => {
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
    UserId: 1,
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
  res.render("admin/allMenu", { pageTitle: "منو ها", path: "/menu" });
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
  const title = req.body.title;
  const navArray = JSON.stringify(req.body.navArray);
  Menu.create({ title: title, navItemArray: navArray, UserId: 1 }).then(data => {
    res.json({ data: 'done' });
  });


};
exports.getEditMenu = (req, res, next) => {
  const menuId = req.params.menuId;
  Menu.findOne({ where: { id: menuId } }).then(data => {
    res.render('admin/updateMenu', { pageTitle: "منو ها", path: "/menu", menuId: menuId, menu: data.dataValues });
  });
};
exports.postEditMenu = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  console.log(title)
  const navArray = JSON.stringify(req.body.navArray);
  Menu.update({ navItemArray: navArray,title:title }, { where: { id: id } }).then(data => {
    res.json({ data: 'done' });
  });
};
exports.deleteMenu = (req, res, next) => {
  res.json({ data: "post edit menu" });
};

//get admin settings
exports.getSettings = (req, res, next) => {
  res.render("admin/admin", { pageTitle: "تنظیمات", path: "/setting" });
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
  res.render("admin/allPosts", { pageTitle: "نوشته ها", path: "/post" });
};
exports.getAddPost = (req, res, next) => {
  res.render("admin/updatePost", {
    pageTitle: "نوشته جدید",
    path: "/post",
    update: false,
    oldInput: "",
  });
};
exports.postAddPost = (req, res, next) => {
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
            postName: title, deltaContent: deltaContent, UserId: 1, path: "/uploads/posts/" + postTitle
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
              res.redirect("/admin/posts");
            });

        } else {
          Post.create({
            postName: title, deltaContent: deltaContent,
            path: "/uploads/posts/" + postTitle,
            UserId: 1,
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
        },
      });
    })
    .catch((err) => {
      console.log(err);
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

// admin pages
exports.getPages = (req, res, next) => {
  res.render("admin/pages", { pageTitle: "صفحه ها", path: "/page" });
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
