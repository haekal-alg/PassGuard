require("dotenv").config();
const bp                    = require("body-parser");
const express               = require("express");
const db                    = require("./database/db");
const authController        = require('./controllers/authController');
const dataController        = require('./controllers/dataController');
const globalErrorHandler    = require('./controllers/errorController');
const app                   = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// PUBLIC TOURS
app.get("/", (req, res) => {
    console.log('hello world!');
});
app.route("/api/register").post(authController.register);
app.route("/api/login").post(authController.login);

// PROTECTED TOURS
// what if the logged in user tried to access other user's data assuming they know other user's id?
// > they can't. there's a condition (in data controller) 
//   to check if the id of the user accessing the data matched with the foreign key in data they're accessing. 
app.route('/api/user/(|loginInfo|secureNote|creditCard)')                                   
    .post(authController.protect, dataController.createData)      // create new one
    .patch(authController.protect, dataController.updateData)     // update existing one
    .delete(authController.protect, dataController.deleteData);   // delete


app.use(globalErrorHandler);

// authenticate and sync to the database
// also make new table if does not already exist
db.sequelize.sync(
    ).then(() => {
        console.log(`[${process.env.NODE_ENV}] Connected and synced to ${process.env.DB_DATABASE} DB`);
    }).catch((err) => {
        console.log("[-] Unable to connect to database: " + err.message);
});

// start the whole server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`[+] Server is running on port ${PORT}`);
});