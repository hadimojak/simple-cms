


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
        unique: true
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
    }, ext: {
        type: DataTypes.STRING,
        allowNull: false,
    }, size: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
        unique: true
    }, deltaContent: {
        type: DataTypes.STRING,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    }, aproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "post"
});

const Menu = sequelize.define('Menu', {
    title: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, content: {
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

User.hasMany(Media, { onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Media.belongsTo(User);
User.hasMany(Post, { onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Post.belongsTo(User);
User.hasMany(Menu, { onDelete: 'SET NULL', onUpdate: 'SET NULL' });
Menu.belongsTo(User);

module.exports = { User, Media, Menu, Page, Setting, Post };