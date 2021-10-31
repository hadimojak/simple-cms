const express = require('express');
const app = express();
const path = require('path');
const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');
// const hook = require('./hooks');
// const flash = require("connect-flash");
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);



const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const installRoutes = require('./routes/installer');

process.setMaxListeners(50);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

const store = new SequelizeStore({
    db: sequelize,checkExpirationInterval: 15 * 60 * 1000,
    expiration:  20*60 * 60 * 1000
    
});
app.use(session({
    secret: 'my secret', store: store, resave: false,
    saveUninitialized: false
}));
store.sync();
// app.use(flash());



// app.use(installRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(homeRoutes);



sequelize.sync().then(async data => {
    await app.listen(3000, () => {
        console.log('Listening on port: ', 3000);
    }).on('error', (e) => {
        throw new Error(e.message);
    });
}).then(data => { console.log('db connected'); })
    .catch(err => { console.log(err); });



