const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    // 1. GET Dashboard Stats (Aggregated)
    router.get('/stats', async (req, res) => {
        try {
            const [schemes] = await pool.query('SELECT COUNT(*) as count FROM schemes');
            const [officers] = await pool.query('SELECT COUNT(*) as count FROM officers');
            const [pending] = await pool.query('SELECT COUNT(*) as count FROM applications WHERE status = "Under Review" OR status = "Pending eKYC"');
            
            res.json({
                totalSchemes: schemes[0].count,
                totalOfficers: officers[0].count,
                pendingApps: pending[0].count
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching stats" });
        }
    });

    // 2. GET all schemes
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM schemes ORDER BY id DESC');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    });

    // 3. PATCH toggle scheme status
    router.patch('/schemes/:id/toggle', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.query('UPDATE schemes SET is_active = NOT is_active WHERE id = ?', [id]);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    });

    // 4. GET all officers
    router.get('/officers', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM officers ORDER BY name ASC');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    });

    // 5. GET all audits
    router.get('/audits', async (req, res) => {
        try {
            const query = `
                SELECT id, actor, action, 
                DATE_FORMAT(action_time, '%Y-%m-%d') as date, 
                DATE_FORMAT(action_time, '%h:%i %p') as time 
                FROM auditlogs ORDER BY action_time DESC`;
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error" });
        }
    });

    return router;
};