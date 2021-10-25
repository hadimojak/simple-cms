const { Sequelize, DataTypes, Model } = require('sequelize');
const connection = {
    host: 'localhost', dialect: 'mysql', dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true, useUTC: false, dateStrings: true,
        typeCast: true
    },timezone: '+03:30'
};

const sequelize = new Sequelize('cms', 'root', '2525', connection
);

module.exports = { sequelize, Sequelize, DataTypes, Model };



