const express = require('express');
const app = express();
const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');
const { User } = require('./models/Model');
// const hook = require('./hooks');
// const flash = require("connect-flash");
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require("bcryptjs");


const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const installRoutes = require('./routes/installer');

const store = new SequelizeStore({
    db: sequelize
});

process.setMaxListeners(50);
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));


app.use(session({
    secret: 'my secret', resave: false, store: store,
    saveUninitialized: false
}));
// app.use(flash());



// app.use(installRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(homeRoutes);



sequelize.sync({ force: true }).then(async data => {

    await app.listen(3000, () => {
        console.log('Listening on port: ', 3000);
    }).on('error', (e) => {
        throw new Error(e.message);
    });
}).then(async data => {
    console.log('db connected');
    await User.findAll({ where: { isAdmin: true } })
        .then(async user => {
            if (user.length > 0) {
                return console.log('admin user is already exict');
            }
            bcrypt.hash('123456789', 12)
                .then(async (hasshedPass) => {
                    try {
                        User.create({
                            firstName: 'هادی',
                            lastName: 'اربابی',
                            email: 'arbabi@yahoo.com',
                            password: hasshedPass,
                            phoneNumber: 09121112233,
                            isAdmin: 1
                        });

                    } catch (error) {

                    }
                });

        });
})
    .catch(err => { console.log(err); });



