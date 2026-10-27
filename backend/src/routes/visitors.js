const express = require('express');
const pool = require('../db');

const router = express.Router();
const STATUSES = ['New', 'Contacted', 'Returned', 'Joined'];

// POST /api/visitors: record a first-time visitor
router.post('/', async (req, res) => {
  const { first_name, last_name, phone, email, visit_date, how_heard, invited_by, notes } = req.body;

  if (!first_name || !visit_date) {
    return res.status(400).json({ error: 'first_name and visit_date are required' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO first_time_visitors
        (first_name, last_name, phone, email, visit_date, how_heard, invited_by, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name ?? null, phone ?? null, email ?? null, visit_date,
       how_heard ?? null, invited_by ?? null, notes ?? null]
    );
    res.status(201).json({ id: result.insertId, message: 'Visitor recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/visitors: newest visits first
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM first_time_visitors ORDER BY visit_date DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/visitors/:id/status: update follow-up status
router.patch('/:id/status', async (req, res) => {
  const { follow_up_status } = req.body;
  if (!STATUSES.includes(follow_up_status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE first_time_visitors SET follow_up_status = ? WHERE id = ?',
      [follow_up_status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;