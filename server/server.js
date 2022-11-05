require("dotenv").config();

const express = require("express");
const app = express();
const { Client } = require("pg");
const bp = require("body-parser");
const PORT = 8080;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432
});

app.get("/", (req, res) => {
    console.log("Hello world!");
});

// DON'T TOUCH THIS
db.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`[*] Connected to ${process.env.DB_DATABASE}`);
  });
  
app.listen(8080, () => {
    console.log(`[*] Server is running on port ${PORT}`);
});