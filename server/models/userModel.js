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
          type: DataTypes.TEXT,
          allowNull: false
     },
     key: {
          type: DataTypes.TEXT,
          allowNull: false
     },
     iv: {
          type: DataTypes.TEXT,
          allowNull: false
     },
     salt: {
          type: DataTypes.TEXT,
          allowNull: false
     },
     }, {
          timestamps: false,
          freezeTableName: true,
     });

module.exports = Users;