const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const db = mysql.createPool({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DATABASE,
   connectionLimit: 100,
});

module.exports = db;
