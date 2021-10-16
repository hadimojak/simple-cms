const { sequelize, DataTypes, Sequelize } = require('../sequelize');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, password: {
        type: DataTypes.STRING,
        allowNull: false,
    }, email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true
    }, phoneNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }, state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }, 
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "admin", paranoid: true
});

module.exports = {User};