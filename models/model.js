


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
    }, isAprover: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    , avatar: {
        type: DataTypes.BLOB,
        allowNull: true,
        defaultValue: "data:image/png;base64,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"
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

const Menu = sequelize.define('Menu', {

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    navItemArray: {
        type: DataTypes.TEXT('long'),
        allowNull: false
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

const Post = sequelize.define('Post', {
    postName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, deltaContent: {
        type: DataTypes.TEXT,
        allowNull: false,
    }, path: {
        type: DataTypes.STRING,
        allowNull: false,
    }, aproved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }, imagePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "post"
});

const Tag = sequelize.define('Tag', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "tag"
});

const Category = sequelize.define('Category', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "category"
});

//one to many relations
User.hasMany(Media, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Media.belongsTo(User);
User.hasMany(Post, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Post.belongsTo(User);
User.hasMany(Menu, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' });
Menu.belongsTo(User);
//many to many relations
Post.belongsToMany(Tag, { through: 'post_tag' });
Tag.belongsToMany(Post, { through: 'post_tag' });
Post.belongsToMany(Category, { through: 'post_category' });
Category.belongsToMany(Post, { through: 'post_category' });
//many to many self relations
Post.belongsToMany(Post, { as: 'similar', through: 'post_similar' });
Category.belongsToMany(Category, { as: 'subCategory', through: 'sub_category' });


module.exports = { User, Media, Menu, Page, Setting, Post, Tag, Category };