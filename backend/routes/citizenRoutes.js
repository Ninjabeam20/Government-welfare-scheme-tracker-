const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = (pool) => {
    // Fetch all active schemes for the Citizen "Browse Schemes" page
    router.get('/schemes', async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM welfareschemes WHERE isactive = 1');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching schemes" });
        }
    });

    // Submit a new application
    router.post('/apply', async (req, res) => {
        const { citizen_id, scheme_id } = req.body;
        try {
            const query = `INSERT INTO currentapplications 
  (BeneficiaryID, SchemeID, Status) 
  VALUES (?, ?, 'Pending')`;
await pool.query(query, [citizen_id, scheme_id]);
            res.json({ success: true, message: "Application submitted!" });
        } catch (error) {
            res.status(500).json({ message: "Error submitting application" });
        }
    });

    // Fetch applications by beneficiary ID
    router.get('/applications/:beneficiaryId', async (req, res) => {
        try {
            const query = `
                SELECT 
                    a.RecordID, 
                    s.SchemeName, 
                    a.Status, 
                    a.Applied_on
                FROM currentapplications a
                JOIN welfareschemes s ON a.SchemeID = s.SchemeID
                WHERE a.BeneficiaryID = ?
                ORDER BY a.Applied_on DESC
            `;
            const [rows] = await pool.query(query, [req.params.beneficiaryId]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: "Error fetching applications" });
        }
    });

    // Track a specific application by record ID
    router.get('/track/:recordId', async (req, res) => {
        try {
            const query = `
                SELECT 
                    a.RecordID, 
                    s.SchemeName, 
                    a.Status, 
                    a.Applied_on
                FROM currentapplications a
                JOIN welfareschemes s ON a.SchemeID = s.SchemeID
                WHERE a.RecordID = ?
            `;
            const [rows] = await pool.query(query, [req.params.recordId]);
            if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: "Error tracking application" });
        }
    });

    router.post('/grievance', async (req, res) => {
  try {
    const { message } = req.body;
    await pool.query(
      `INSERT INTO auditlogs (ActorType, ActionDetails) VALUES ('Citizen', ?)`,
      [message]
    );
    res.json({ success: true, message: "Grievance submitted!" });
  } catch (error) {
    console.log('Grievance error:', error.message);
    res.status(500).json({ message: "Error submitting grievance" });
  }
});
router.get('/profile/:beneficiaryId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT BeneficiaryID, Name, Email, Income, Category FROM individualbeneficiaries WHERE BeneficiaryID=?',
      [req.params.beneficiaryId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});
// Upload document
router.post('/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const { beneficiaryId, docType } = req.body;
    const fileName = req.file.originalname;
    const filePath = req.file.filename;
    await pool.query(
      `INSERT INTO documents (BeneficiaryID, DocType, FileName, FilePath, Status, UploadedOn) 
       VALUES (?, ?, ?, ?, 'Pending', NOW())`,
      [beneficiaryId, docType, fileName, filePath]
    );
    res.json({ success: true, message: 'Document uploaded' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Serve file for preview
router.get('/documents/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
  res.sendFile(filePath);
});
// Get documents for a citizen
router.get('/documents/:beneficiaryId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM documents WHERE BeneficiaryID = ? ORDER BY UploadedOn DESC`,
      [req.params.beneficiaryId]
    );
    res.json(rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});
    return router;
};