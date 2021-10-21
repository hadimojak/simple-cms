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
    modelName: "user", paranoid: true
});

const Media = sequelize.define('Media', {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    }, mimetype: {
        type: DataTypes.STRING,
        allowNull: false,
    }, size: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "user", paranoid: true
});

User.hasMany(Media, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Media.belongsTo(User);

module.exports = { User };