const config                = require('./config');
const db                    = require("./database/db");
const authController        = require('./controllers/authController');
const dataController        = require('./controllers/dataController');
const globalErrorHandler    = require('./controllers/errorController');
const userController        = require('./controllers/userController');
const bp                    = require("body-parser");
const express               = require("express");
const cors                  = require("cors");
const app                   = express();
const compression           = require('compression');
const path                  = require('path');
const xss                   = require('xss-clean');

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use(compression());

app.use(xss());

// --- APIs ---
// PUBLIC TOURS
app.get("/api/test", (req, res) => {
    res.send("hello from backend!");
});
app.route("/api/register").post(authController.register);
app.route("/api/verification/:token").get(authController.verify);
app.route("/api/login").post(authController.login);

// PROTECTED TOURS
app.route("/api/sync").get(authController.protect, userController.sync);
app.route('/api/user/(|loginInfo|secureNote|creditCard)')                                   
    .post(authController.protect, dataController.createData)      // create new one
    .patch(authController.protect, dataController.updateData)     // update existing one
    .delete(authController.protect, dataController.deleteData);   // delete

// --- STATIC FILES FROM CLIENT-SIDE ---
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {  // handles client-side routing
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ERROR HANDLING
app.use(globalErrorHandler);

// authenticate and sync to the database
// also make new table if does not already exist
db.sequelize.sync({ force: true })
    .then(() => {
        console.log(`[${config.NODE_ENV.toUpperCase()}] Connected and synced to ${config.DB_DATABASE} DB`); })
    .catch((err) => {
        console.log("[-] Unable to connect to database: " + err.message);
});

// start the whole server
app.listen(config.PORT, () => {
    console.log(`[${config.NODE_ENV.toUpperCase()}] Server is running on port ${config.PORT}`);
});