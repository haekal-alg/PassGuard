require("dotenv").config();
const db                    = require("./database/db");
const bp                    = require("body-parser");
const authController        = require('./controllers/authController');
const loginInfoController   = require('./controllers/loginInfoController');
const userController        = require('./controllers/userController');
const express               = require("express");
const app                   = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log('hello world!');
});


// public tours
app.route("/api/register").post(authController.register);
app.route("/api/login").post(authController.login);

// protected tours
//app.route('/api/user/createNewLoginInfo').post(loginInfoController.createNewLoginInfo);


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