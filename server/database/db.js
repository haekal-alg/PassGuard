require("dotenv").config();

// [TODO]
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        logging: false,
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;