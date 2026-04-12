require("dotenv").config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'bms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then((connection) => {
        console.log("database connected ");
        connection.release();
    })
    .catch((error) => {
        console.error("database not connected", error);
    });

module.exports = pool;