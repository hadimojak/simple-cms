const { Sequelize, DataTypes, Model } = require('sequelize');
const connection = {
    host: 'localhost', dialect: 'mysql', dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    }
};

const sequelize = new Sequelize('cms', 'root', '2525', connection
);

module.exports = { sequelize, Sequelize, DataTypes, Model };



