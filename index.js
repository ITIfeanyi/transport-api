const express = require("express");
const dotenv = require("dotenv");
const debug = require("debug")("index.js");

const app = express();
dotenv.config();

const db = require("./db_config/dev/dbConnection");
// db.createAllTables();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
