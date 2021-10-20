const { Sequelize, DataTypes, Model } = require('sequelize');
const connection = {
    host: 'localhost', dialect: 'mysql', dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    }
};

const sequelize = new Sequelize('cms', 'root', '0015166031', connection
);

module.exports = { sequelize, Sequelize, DataTypes, Model };



