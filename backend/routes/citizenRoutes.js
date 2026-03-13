const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // Fetch all active schemes for the Citizen "Browse Schemes" page
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM schemes WHERE is_active = TRUE');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching schemes" });
        }
    });

    // Submit a new application
    router.post('/apply', async (req, res) => {
        const { citizen_id, scheme_id } = req.body;
        try {
            const query = `INSERT INTO applications (citizen_id, scheme_id, status) VALUES (?, ?, 'Pending eKYC')`;
            await pool.query(query, [citizen_id, scheme_id]);
            res.json({ success: true, message: "Application submitted!" });
        } catch (error) {
            res.status(500).json({ message: "Error submitting application" });
        }
    });

    return router;
};