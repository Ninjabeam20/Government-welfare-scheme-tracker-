const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'welfare_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@1234',
  database: process.env.DB_NAME || 'welfare_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => console.log('Database connected'))
  .catch(err => console.log('DB Error:', err.message));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;
  try {
    const [admins] = await pool.query('SELECT * FROM admins WHERE Email=?', [email]);
    if (admins.length > 0) {
      return done(null, { userId: admins[0].AdminID, role: 'admin', name, email });
    }
    const [officers] = await pool.query('SELECT * FROM officers WHERE Email=?', [email]);
    if (officers.length > 0) {
      return done(null, { userId: officers[0].OfficerID, role: 'officer', name, email });
    }
    const [citizens] = await pool.query(
      'SELECT * FROM individualbeneficiaries WHERE Email=?', [email]
    );
    if (citizens.length > 0) {
      return done(null, { userId: citizens[0].BeneficiaryID, role: 'citizen', name, email });
    }
    const [result] = await pool.query(
  `INSERT INTO individualbeneficiaries (Name, Email, Aadhaar, Income, Category) 
   VALUES (?, ?, NULL, 0, 'General')`,
  [name, email]
);
return done(null, { userId: result.insertId, role: 'citizen', name, email });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const officerRoutes = require('./routes/officerRoutes')(pool);
const citizenRoutes = require('./routes/citizenRoutes')(pool);
const adminRoutes = require('./routes/adminRoutes')(pool);
const authRoutes = require('./routes/authRoutes')(pool);

app.use('/api/officer', officerRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/admin', adminRoutes);
app.use('/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'success', message: 'Backend running' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Unified Server running on http://localhost:${PORT}`));