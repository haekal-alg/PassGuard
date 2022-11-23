require("dotenv").config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        logging: false,
        host: process.env.DB_HOST,
        returning: true,
        dialect: 'postgres'
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;