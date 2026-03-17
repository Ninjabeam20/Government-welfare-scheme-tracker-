const express = require('express');
const router = express.Router();

// We export a function that accepts the MySQL 'pool' from server.js
module.exports = (pool) => {

    // GET API: Fetch all applications awaiting verification
    // Route: GET /api/officer/queue/:officerId
    router.get('/queue/:officerId', async (req, res) => {
        try {
            const query = `
                SELECT 
                    a.RecordID, 
                    c.Name, 
                    c.Email,
                    c.Aadhaar,
                    c.Income,
                    s.SchemeName, 
                    a.Applied_on, 
                    a.Status
                FROM currentapplications a
                JOIN individualbeneficiaries c ON a.BeneficiaryID = c.BeneficiaryID
                JOIN welfareschemes s ON a.SchemeID = s.SchemeID
                WHERE a.Status = 'Pending';
            `;
            
            const [rows] = await pool.query(query);
            res.json(rows); // Send the rows back to the React frontend
        } catch (error) {
            console.error("Error fetching applications:", error.message);
            res.status(500).json({ message: "Failed to fetch pending applications." });
        }
    });

    // PUT API: Approve application
    // Route: PUT /api/officer/applications/:id/approve
    router.put('/applications/:id/approve', async (req, res) => {
        const applicationId = req.params.id;

        try {
            // Update the application status
            const updateQuery = `UPDATE currentapplications SET Status = 'Approved' WHERE RecordID = ?`;
            await pool.query(updateQuery, [applicationId]);
            
            // Log the action to auditlogs
            const logQuery = `INSERT INTO auditlogs (ActorType, ActionDetails) VALUES ('Officer', ?)`;
            await pool.query(logQuery, [`Approved application #${applicationId}`]);

            res.json({ 
                success: true, 
                message: `Application ${applicationId} successfully marked as Approved.` 
            });
        } catch (error) {
            console.error("Error approving application:", error.message);
            res.status(500).json({ message: "Failed to approve application." });
        }
    });

    // PUT API: Reject application
    // Route: PUT /api/officer/applications/:id/reject
    router.put('/applications/:id/reject', async (req, res) => {
        const applicationId = req.params.id;

        try {
            // Update the application status
            const updateQuery = `UPDATE currentapplications SET Status = 'Rejected' WHERE RecordID = ?`;
            await pool.query(updateQuery, [applicationId]);
            
            // Log the action to auditlogs
            const logQuery = `INSERT INTO auditlogs (ActorType, ActionDetails) VALUES ('Officer', ?)`;
            await pool.query(logQuery, [`Rejected application #${applicationId}`]);

            res.json({ 
                success: true, 
                message: `Application ${applicationId} successfully marked as Rejected.` 
            });
        } catch (error) {
            console.error("Error rejecting application:", error.message);
            res.status(500).json({ message: "Failed to reject application." });
        }
    });

    return router;
};