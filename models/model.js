const { sequelize, DataTypes, Sequelize, Model } = require('../sequelize');


class Admin extends Model { };
Admin.init({
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
    }, number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
},
    {
        sequelize: sequelize, freezeTableName: true,
        modelName: "admin", paranoid: true
    }
);


class Editor extends Model { };
Editor.init({
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
    }, number: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
},
    {
        sequelize: sequelize, freezeTableName: true,
        modelName: "editor", paranoid: true
    }
);





const models = [Admin, Editor];

module.exports = { models, Admin, Editor };