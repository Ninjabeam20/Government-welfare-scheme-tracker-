const express = require('express');
const router = express.Router();

// We export a function that accepts the MySQL 'pool' from server.js
module.exports = (pool) => {

    // 1. GET API: Fetch all applications awaiting verification
    // Route: GET /api/officer/applications/pending
    router.get('/applications/pending', async (req, res) => {
        try {
            // We join 3 tables to match the exact data structure your React frontend expects!
            const query = `
                SELECT 
                    a.id, 
                    c.full_name AS name, 
                    s.scheme_name AS scheme, 
                    DATE_FORMAT(a.applied_on, '%d %b %Y') AS date, 
                    a.status, 
                    c.income 
                FROM applications a
                JOIN citizens c ON a.citizen_id = c.id
                JOIN schemes s ON a.scheme_id = s.id
                WHERE a.status NOT IN ('Approved', 'Rejected', 'Routed to DBT')
                ORDER BY a.applied_on DESC;
            `;
            
            const [rows] = await pool.query(query);
            res.json(rows); // Send the rows back to the React frontend
        } catch (error) {
            console.error("Error fetching applications:", error);
            res.status(500).json({ message: "Failed to fetch pending applications." });
        }
    });

    // 2. PATCH API: Update application status (Approve / Reject)
    // Route: PATCH /api/officer/applications/:id/status
    router.patch('/applications/:id/status', async (req, res) => {
        const applicationId = req.params.id;
        const { status } = req.body; // e.g., "Approved" or "Rejected"

        try {
            const query = `UPDATE applications SET status = ? WHERE id = ?`;
            await pool.query(query, [status, applicationId]);
            
            res.json({ 
                success: true, 
                message: `Application ${applicationId} successfully marked as ${status}.` 
            });
        } catch (error) {
            console.error("Error updating status:", error);
            res.status(500).json({ message: "Failed to update application status." });
        }
    });

    return router;
};