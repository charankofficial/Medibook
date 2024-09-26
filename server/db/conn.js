const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
});

console.log("Connection successful to db");

module.exports = db; 