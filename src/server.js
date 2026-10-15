const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: rows[0].ok === 1 ? 'connected' : 'unexpected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'not connected', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
