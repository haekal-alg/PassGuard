const db              = require("./database/db");
const bp              = require("body-parser");
const authController  = require('./controllers/authController')
const express         = require("express");
const app             = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log('hello world!');
});

// public tours
app.post("/api/register", authController.register);
app.post("/api/login", authController.login);

// protected tours

// sync with the database
db.sequelize.authenticate()
  .then(() => {
    console.log("[*] Synced db.");
  })
  .catch((err) => {
    console.log("[-] Failed to sync db: " + err.message);
  });


// start the whole server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`[*] Server is running on port ${PORT}`);
});