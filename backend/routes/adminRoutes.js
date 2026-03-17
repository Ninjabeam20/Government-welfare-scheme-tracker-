const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    
    // 1. GET all schemes
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM welfareschemes'); 
            res.json(rows);
        } catch (error) {
            console.error("GET Error:", error);
            res.status(500).json({ message: "Error fetching schemes" });
        }
    });

    // 2. POST: Create a new scheme
    router.post('/schemes', async (req, res) => {
        const { scheme_name, description } = req.body;
        try {
            const query = `INSERT INTO welfareschemes (SchemeName, Description) VALUES (?, ?)`;
            await pool.query(query, [scheme_name, description]);
            res.status(201).json({ success: true, message: "Scheme created!" });
        } catch (error) {
            console.error("POST Error:", error);
            res.status(500).json({ message: "Error creating scheme" });
        }
    });

    // 3. GET all officers
    router.get('/officers', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM officers');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching officers" });
        }
    });

    // 4. GET Audit Logs
    router.get('/audits', async (req, res) => {
        try {
            const query = `SELECT * FROM auditlogs ORDER BY ActionTime DESC`;
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching audit logs" });
        }
    });


    router.patch('/schemes/:id/toggle', async (req, res) => {
    const { id } = req.params;
    const { isactive } = req.body;
    try {
        await pool.query('UPDATE welfareschemes SET isactive = ? WHERE SchemeID = ?', [isactive, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    return router;
};