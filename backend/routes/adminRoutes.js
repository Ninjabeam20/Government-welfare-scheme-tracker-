const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    
    // 1. GET all schemes
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT SchemeID, SchemeName, Description, isactive, max_income FROM welfareschemes'); 
            res.json(rows);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error fetching schemes" });
        }
    });

    // 2. POST: Create a new scheme
    router.post('/schemes', async (req, res) => {
        const { SchemeName, Description, isactive, max_income } = req.body;
        try {
            const query = `INSERT INTO welfareschemes (SchemeName, Description, isactive, max_income) VALUES (?, ?, ?, ?)`;
            await pool.query(query, [SchemeName, Description, isactive, max_income]);
            const auditQuery = `INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES (?, ?, NOW())`;
            await pool.query(auditQuery, ['Admin', `Created scheme: ${SchemeName}`]);
            res.status(201).json({ success: true, message: "Scheme created" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error creating scheme" });
        }
    });

    // 3. PUT: Update a scheme
    router.put('/schemes/:id', async (req, res) => {
        const { id } = req.params;
        const { SchemeName, Description, isactive, max_income } = req.body;
        try {
            const query = `UPDATE welfareschemes SET SchemeName=?, Description=?, isactive=?, max_income=? WHERE SchemeID=?`;
            await pool.query(query, [SchemeName, Description, isactive, max_income, id]);
            const auditQuery = `INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES (?, ?, NOW())`;
            await pool.query(auditQuery, ['Admin', `Updated scheme: ${SchemeName}`]);
            res.json({ success: true, message: "Scheme updated" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error updating scheme" });
        }
    });

    // 4. PUT: Toggle scheme status
    router.put('/schemes/:id/toggle', async (req, res) => {
        const { id } = req.params;
        try {
            const [scheme] = await pool.query('SELECT SchemeName FROM welfareschemes WHERE SchemeID=?', [id]);
            const schemeName = scheme[0] ? scheme[0].SchemeName : 'Unknown';
            const query = `UPDATE welfareschemes SET isactive = NOT isactive WHERE SchemeID=?`;
            await pool.query(query, [id]);
            const auditQuery = `INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES (?, ?, NOW())`;
            await pool.query(auditQuery, ['Admin', `Toggled scheme status: ${schemeName}`]);
            res.json({ success: true, message: "Scheme status toggled" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error toggling scheme" });
        }
    });

    // 5. DELETE: Delete a scheme
    router.delete('/schemes/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [scheme] = await pool.query('SELECT SchemeName FROM welfareschemes WHERE SchemeID=?', [id]);
            const schemeName = scheme[0] ? scheme[0].SchemeName : 'Unknown';
            const query = `DELETE FROM welfareschemes WHERE SchemeID=?`;
            await pool.query(query, [id]);
            const auditQuery = `INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES (?, ?, NOW())`;
            await pool.query(auditQuery, ['Admin', `Deleted scheme: ${schemeName}`]);
            res.json({ success: true, message: "Scheme deleted" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error deleting scheme" });
        }
    });

    // 6. GET all officers
    router.get('/officers', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT OfficerID, Name, Email, Department, Status FROM officers');
            res.json(rows);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error fetching officers" });
        }
    });

    // 7. PUT: Update officer status
    router.put('/officers/:id/status', async (req, res) => {
        const { id } = req.params;
        const { Status } = req.body;
        try {
            const [officer] = await pool.query('SELECT Name FROM officers WHERE OfficerID=?', [id]);
            const officerName = officer[0] ? officer[0].Name : 'Unknown';
            const query = `UPDATE officers SET Status=? WHERE OfficerID=?`;
            await pool.query(query, [Status, id]);
            const auditQuery = `INSERT INTO auditlogs (ActorType, ActionDetails, ActionTime) VALUES (?, ?, NOW())`;
            await pool.query(auditQuery, ['Admin', `Changed officer status to ${Status}: ${officerName}`]);
            res.json({ success: true, message: `Officer status updated` });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error updating officer status" });
        }
    });

    // 8. GET Audit Logs
    router.get('/auditlogs', async (req, res) => {
        try {
            const query = `SELECT LogID, ActorType, ActionDetails, ActionTime FROM auditlogs ORDER BY ActionTime DESC`;
            const [rows] = await pool.query(query);
            res.json(rows);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Error fetching audit logs" });
        }
    });

    return router;
};
