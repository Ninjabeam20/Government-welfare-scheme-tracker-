const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Create MySQL Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',        
    password: process.env.DB_PASSWORD || '',    
    database: process.env.DB_NAME || 'welfare_core_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// IMPORT ROUTES
// ==========================================
// We pass the MySQL 'pool' into our route files so they can query the database
const officerRoutes = require('./routes/officerRoutes')(pool);

// Mount the routes to URLs
app.use('/api/officer', officerRoutes);


// Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.status(200).json({ status: 'success', message: '🚀 Backend is running!' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});