const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs'); // For Windows compatibility
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_SECRET = 'your_jwt_secret_key'; // Use .env in production

// ✅ Register Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    // Check if user already exists
    const checkUser = 'SELECT * FROM users WHERE LOWER(email) = ?';
    db.query(checkUser, [normalizedEmail], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password and insert new user
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(sql, [name, normalizedEmail, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Registration error:', err);
          return res.status(500).json({ message: 'Registration failed' });
        }
        return res.status(201).json({ success: true, message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Registration server error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// ✅ Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const sql = 'SELECT * FROM users WHERE LOWER(email) = ?';

  db.query(sql, [normalizedEmail], async (err, results) => {
    if (err) {
      console.error('Login DB error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials - user not found' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials - wrong password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  });
});

module.exports = router;
