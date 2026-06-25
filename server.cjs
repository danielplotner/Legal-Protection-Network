const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for lead capture
app.post('/api/leads', (req, res) => {
  const { firstName, email, quizData } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Store in team-db
  // We'll use a simple JSON string for quizData to store in a single column if needed, 
  // or just store email and name.
  // First, let's ensure the table exists.
  const createTableSql = `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    email TEXT UNIQUE,
    quiz_results TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;

  exec(`team-db "${createTableSql}"`, (err) => {
    if (err) {
      console.error('Error creating leads table:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const quizResultsStr = quizData ? JSON.stringify(quizData).replace(/"/g, '\\"') : '';
    const insertSql = `INSERT OR IGNORE INTO leads (first_name, email, quiz_results) 
                       VALUES ('${firstName || ''}', '${email}', '${quizResultsStr}')`;

    exec(`team-db "${insertSql}"`, (err) => {
      if (err) {
        console.error('Error inserting lead:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, message: 'Lead captured successfully' });
    });
  });
});

// Fallback to index.html for SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
