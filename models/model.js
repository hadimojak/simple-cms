const { sequelize, DataTypes, Sequelize, Model } = require('../sequelize');

//for example i create User and Product models and although UserHistory and ProductHistory models and 
//id (primary key) are build automaticly with sequelize
class Admin extends Model { };
Admin.init({
    firstName: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, lastName: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, password: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, email: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        isEmail: true,
        notEmpty: true
    }, number: {
        type: DataTypes.DECIMAL(14),
        notNull: true,
        allowNull: false,
        notEmpty: true,
        isEmail: true
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        notNull: true,
        allowNull: false,
        notEmpty: false,
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
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, lastName: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, password: {
        type: DataTypes.TEXT,
        notNull: true,
        allowNull: false,
        notEmpty: true
    }, email: {
        type: DataTypes.STRING,
        notNull: true,
        allowNull: false,
        isEmail: true,
        notEmpty: true
    }, number: {
        type: DataTypes.INTEGER,
        notNull: true,
        allowNull: false,
        isNumeric: true,
        notEmpty: true
    }, isAdmin: {
        type: DataTypes.BOOLEAN,
        notNull: true,
        allowNull: false,
        notEmpty: false,
        defaultValue: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
},
    {
        sequelize: sequelize, freezeTableName: true,
        modelName: "editor", paranoid: true,
    }
);

Admin.hasMany(Editor);
Editor.belongsTo(Admin);


let justOnce = true;
if (justOnce) {
    (async () => {
        await Admin.sync({ alter: true });
        await Editor.sync({ alter: true });
    })();

    justOnce = false;
}

const models = [Admin, Editor];

module.exports = { models, Admin, Editor };