


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
    modelName: "user"
});

const Media = sequelize.define('Media', {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, originalName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, thumb: {
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
    modelName: "user"
});

const Post = sequelize.define('Post', {
    postName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "post"
});

const Menu = sequelize.define('Menu', {
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, menuName: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "menu"
});

const Setting = sequelize.define('Setting', {
    settingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "setting"
});

const Page = sequelize.define('Page', {
    pageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, pageName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, action: {
        type: DataTypes.STRING,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "page"
});

User.hasMany(Media, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Media.belongsTo(User);
User.hasMany(Post, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Post.belongsTo(User);
User.hasMany(Menu, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Menu.belongsTo(User);

module.exports = { User, Media, Menu, Page, Setting, Post };