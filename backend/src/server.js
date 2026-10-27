const express = require('express');
const pool = require('./db');
const departmentRoutes = require('./routes/departments');
const membersRouter = require('./routes/members');
const visitorsRouter = require('./routes/visitors');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());

app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', database: rows[0].ok === 1 ? 'connected' : 'unexpected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'not connected', message: err.message });
  }
});

app.use('/api/departments', departmentRoutes);
app.use('/api/members', membersRouter);
app.use('/api/visitors', visitorsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});