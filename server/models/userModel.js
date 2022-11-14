const { Sequelize, DataTypes } = require("sequelize");
const db = require("../database/db");

const Users = db.sequelize.define("users", {
     userId: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
     },
     name: {
          type: DataTypes.STRING,
          allowNull: false
     },
     email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
     },
     masterPassword: {
          type: DataTypes.STRING,
          allowNull: false
     },
     key: {
          type: DataTypes.STRING,
          allowNull: false
     },
     salt: {
          type: DataTypes.STRING,
          allowNull: false
     },
     }, {
          timestamps: false,
          freezeTableName: true,
     });

module.exports = Users;