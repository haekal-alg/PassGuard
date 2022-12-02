const config = require('./../config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB_DATABASE,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        logging: false,
        host: config.DB_HOST,
        returning: true,
        dialect: 'postgres',
        dialectOptions: {
            ssl: (config.NODE_ENV == 'development') ? false : true
        }
    },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;