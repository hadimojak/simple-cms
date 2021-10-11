const { sequelize, DataTypes, Sequelize, Model } = require('./sequelize');

//for example i create User and Product models and although UserHistory and ProductHistory models and 
//id (primary key) are build automaticly with sequelize
class User extends Model { };
User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    }, lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
},
    {
        sequelize: sequelize, freezeTableName: true,
        modelName: "user", paranoid: true
    }
);


class Product extends Model { };
Product.init({
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    }, price: {
        type: DataTypes.INTEGER,
        allowNull: true
    }, store: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {
    sequelize: sequelize, freezeTableName: true,
    modelName: "product", paranoid: true
}
);

User.hasMany(Product);
Product.belongsTo(User);

let justOnce = true;
if (justOnce) {
    (async () => {
        await User.sync({ alter: true });
        await Product.sync({ alter: true });
    })();

    justOnce = false;
}
console.log(justOnce)

const models = [User, Product];

module.exports = { models, User, Product };