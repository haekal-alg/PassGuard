require("dotenv").config();
const bp                    = require("body-parser");
const express               = require("express");
const db                    = require("./database/db");
const authController        = require('./controllers/authController');
const loginInfoController   = require('./controllers/loginInfoController');
const globalErrorHandler    = require('./controllers/errorController');
const app                   = express();


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// public tours
app.get("/", (req, res) => {
    console.log('hello world!');
});
app.route("/api/register").post(authController.register);
app.route("/api/login").post(authController.login);

// protected tours
// [TODO] what if the logged in user tried to access other user's data if they know other user's id?
app.route('/api/user/loginInfo')
    .post(authController.protect, loginInfoController.createNewLoginInfo)   // create new one
    .patch(authController.protect, loginInfoController.updateLoginInfo)     // update existing one
    .delete(authController.protect, loginInfoController.deleteLoginInfo);   // delete

// [TODO] create tours for secure note 

// [TODO] create tours for secure note 

app.use(globalErrorHandler);

// authenticate and sync to the database
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