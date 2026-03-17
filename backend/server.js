const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import the unified pool
const pool = require('./db');

// Import Route Handlers
const officerRoutes = require('./routes/officerRoutes')(pool);
const citizenRoutes = require('./routes/citizenRoutes')(pool);
const adminRoutes = require('./routes/adminRoutes')(pool);

// Mount API Routes
app.use('/api/officer', officerRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'success', message: 'Backend is Live!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});