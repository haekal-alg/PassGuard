const { Sequelize, DataTypes } = require("sequelize");
const db = require("../database/db");
const users = require("./userModel");

const creditCard = db.sequelize.define("creditCard", {
     creditCardId: {
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
         allowNull: false,
          validate: {
               checkLength(value) {
                    if (value.length <= 0) { throw new Error("Name cannot be empty"); }
               },
          },
     },
     holderName: {
         type: DataTypes.STRING,
         allowNull: true
     },
     cardNumber: {
         type: DataTypes.STRING,
         allowNull: true
     },
     brand: {
         type: DataTypes.STRING,
         allowNull: true
     },
     expirationDate: {
          type: DataTypes.STRING,
          allowNull: true
     },
     }, {
          timestamps: false,
          freezeTableName: true,
     });

module.exports = creditCard;