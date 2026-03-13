const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // 1. GET all schemes for Admin table
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM schemes ORDER BY id DESC');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching schemes" });
        }
    });

    // 2. POST: Create a new scheme
    router.post('/schemes', async (req, res) => {
        const { scheme_name, description, max_income } = req.body;
        try {
            const query = `INSERT INTO schemes (scheme_name, description, max_income) VALUES (?, ?, ?)`;
            await pool.query(query, [scheme_name, description, max_income]);
            res.status(201).json({ success: true, message: "Scheme created successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Error creating scheme" });
        }
    });

    // 3. GET all officers (Linked to teammate's 'officers' table logic)
    router.get('/officers', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM officers');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching officers" });
        }
    });

    // 4. GET Audit Logs (Chronological - Latest First)
    router.get('/audits', async (req, res) => {
        try {
            const query = `
                SELECT LogID as id, ActorType as actor, ActionDetails as action, 
                DATE_FORMAT(ActionTime, '%Y-%m-%d') as date, 
                DATE_FORMAT(ActionTime, '%h:%i %p') as time 
                FROM auditlogs ORDER BY ActionTime DESC`;
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching audit logs" });
        }
    });

    return router;
};