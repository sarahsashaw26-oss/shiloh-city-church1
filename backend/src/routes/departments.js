const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/departments: all departments, each with its leaders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id AS department_id, d.name, d.description,
             l.id AS leader_id, l.full_name, l.role_title, l.phone
      FROM departments d
      LEFT JOIN leaders l ON l.department_id = d.id
      ORDER BY d.name, l.full_name
    `);

    const departments = [];
    const byId = new Map();

    for (const row of rows) {
      if (!byId.has(row.department_id)) {
        const dept = {
          id: row.department_id,
          name: row.name,
          description: row.description,
          leaders: [],
        };
        byId.set(row.department_id, dept);
        departments.push(dept);
      }
      if (row.leader_id) {
        byId.get(row.department_id).leaders.push({
          id: row.leader_id,
          full_name: row.full_name,
          role_title: row.role_title,
          phone: row.phone,
        });
      }
    }

    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
