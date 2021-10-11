const express = require('express');
const app = express();
const path = require('path');
const { sync, authentiacete } = require('./sync');
const { models, Admin, Editor } = require('./models/model');
const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');
// const hook = require('./hooks');

console.log(Object.keys(sequelize.models));



const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const editorRoutes = require('./routes/editor');
const endUserRoutes = require('./routes/endUser');
const installRoutes = require('./routes/installer');

process.setMaxListeners(50);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + '/public'));

// app.use(installRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(editorRoutes);
// app.use(endUserRoutes);


authentiacete().then(async data => {
    try {
        app.listen(3000, () => {
            console.log('Listening on port: ', 3000);
        }).on('error', (e) => {
            throw new Error(e.message);
        });
    } catch (error) {
        console.log(error);
    }
});


