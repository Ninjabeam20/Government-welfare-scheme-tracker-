const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// MySQL Database Connection Pool (Using Teammate's DB Name)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',        
    password: process.env.DB_PASSWORD || '',    
    database: process.env.DB_NAME || 'welfare_core_system', // Sync with teammate
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// IMPORT ROUTES
// ==========================================
const officerRoutes = require('./routes/officerRoutes')(pool);
const citizenRoutes = require('./routes/citizenRoutes')(pool); // New
const adminRoutes = require('./routes/adminRoutes')(pool);     // New

// Mount the routes
app.use('/api/officer', officerRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'success', message: '🚀 Unified Backend is running!' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Unified Server running on http://localhost:${PORT}`);
});