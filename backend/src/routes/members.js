const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// POST /api/members/register: self-registration
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, phone, password, gender, date_of_birth, address, department_id } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'first_name, last_name, email and password are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO members
        (first_name, last_name, email, phone, password_hash, gender, date_of_birth, address, department_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone ?? null, password_hash,
       gender ?? null, date_of_birth ?? null, address ?? null, department_id ?? null]
    );
    res.status(201).json({ id: result.insertId, message: 'Registration successful' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'This email is already registered' });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members: all members (password hash is never sent)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, gender, department_id, joined_at
       FROM members ORDER BY joined_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST /api/members/login: returns a token for the member
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, password_hash, is_active FROM members WHERE email = ?',
      [email]
    );
    const member = rows[0];

    if (!member || !member.is_active) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: member.id, email: member.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      member: { id: member.id, first_name: member.first_name, last_name: member.last_name, email: member.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;