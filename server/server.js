require("dotenv").config();
const db                    = require("./database/db");
const authController        = require('./controllers/authController');
const dataController        = require('./controllers/dataController');
const globalErrorHandler    = require('./controllers/errorController');
const bp                    = require("body-parser");
const express               = require("express");
const cors                  = require("cors");
const app                   = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

// PUBLIC TOURS
app.get("/api/test", (req, res) => {
    res.send("hello from backend!");
});
app.route("/api/register").post(authController.register);
app.route("/api/login").post(authController.login);

// PROTECTED TOURS
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
app.listen(process.env.PORT, () => {
    console.log(`[+] Server is running on port ${process.env.PORT}`);
});