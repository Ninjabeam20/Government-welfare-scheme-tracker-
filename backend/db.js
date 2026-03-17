const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a unified pool that all routes (Admin, Citizen, Officer) will use
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'welfare_core_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('✔ MySQL Pool Created');

module.exports = pool;