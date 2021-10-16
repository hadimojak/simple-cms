const express = require('express');
const app = express();
const path = require('path');
const { User } = require('./models/model');
const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');
// const hook = require('./hooks');
const multer = require('multer');

const upload = multer({dest:"uploads/"})

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const editorRoutes = require('./routes/editor');
const endUserRoutes = require('./routes/endUser');
const installRoutes = require('./routes/installer');

process.setMaxListeners(50);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// app.use(installRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(editorRoutes);
// app.use(endUserRoutes);



sequelize.sync({ alter: false }).then(async data => {
    await app.listen(3000, () => {
        console.log('Listening on port: ', 3000);
    }).on('error', (e) => {
        throw new Error(e.message);
    });
}).then(data => { console.log('db connected'); })
    .catch(err => { console.log(err); });



