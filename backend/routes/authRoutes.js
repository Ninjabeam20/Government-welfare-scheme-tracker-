const express = require('express');
const passport = require('passport');
const router = express.Router();

module.exports = (pool) => {

  router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=not_registered' }),
    (req, res) => {
      const role = req.user.role;
      if (role === 'admin') return res.redirect('http://localhost:5173/admin/dashboard');
      if (role === 'officer') return res.redirect('http://localhost:5173/officer/dashboard');
      if (role === 'citizen') return res.redirect('http://localhost:5173/citizen/dashboard');
      res.redirect('http://localhost:5173/login?error=not_registered');
    }
  );

  router.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    res.json(req.user);
  });

  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  return router;
};