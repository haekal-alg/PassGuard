const { Sequelize, DataTypes } = require("sequelize");
const db = require("../database/db");
const users = require("./userModel");

const secureNote = db.sequelize.define("secureNote", {
     secureNoteId: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
     },
     userId: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          references: {
               model: users,      
               key: 'userId'
          }
     },
     name: {
          type: DataTypes.STRING,
          allowNull: false
     },
     notes: {
          type: DataTypes.STRING,
          allowNull: true
     },
     }, {
         timestamps: false,
         freezeTableName: true,
     });

module.exports = secureNote;