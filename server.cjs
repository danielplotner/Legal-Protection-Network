const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// On Render, we use a local JSON file for persistence because Turso/SQLite
// might not be available in the same way.
const USE_LOCAL_DB = process.env.RENDER === 'true';
const DB_FILE = path.join(__dirname, 'leads.json');

if (USE_LOCAL_DB && !fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for lead capture
app.post('/api/leads', (req, res) => {
  const { firstName, name, email, quizData } = req.body;
  
  // Use either firstName (old) or name (new engineer version)
  const leadName = name || firstName || '';
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const recommendation = quizData?.recommendation || '';
  const score = quizData?.score || 0;

  // Capture UTM parameters from body (preferred) or query
  const utm_source = req.body.utm_source || req.query.utm_source || '';
  const utm_medium = req.body.utm_medium || req.query.utm_medium || '';
  const utm_campaign = req.body.utm_campaign || req.query.utm_campaign || '';
  const utm_content = req.body.utm_content || req.query.utm_content || '';
  const utm_term = req.body.utm_term || req.query.utm_term || '';

  if (USE_LOCAL_DB) {
    // Production (Render): store in local JSON file
    try {
      const leads = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      // Check for duplicate email
      if (leads.some(l => l.email === email)) {
        return res.json({ success: true, message: 'Lead already exists', score, recommendation });
      }
      const lead = {
        id: Date.now(),
        first_name: leadName,
        name: leadName,
        email,
        quiz_results: quizData || {},
        result_recommendation: recommendation,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        created_at: new Date().toISOString()
      };
      leads.push(lead);
      fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2));
      return res.json({ success: true, message: 'Lead captured', score, recommendation });
    } catch (e) {
      console.error('Local DB error:', e);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // Dev sandbox: use team-db CLI
  const TEAM_DB = 'team-db';
  function runTeamDb(sql, callback) {
    const escaped = sql.replace(/"/g, '\\"');
    exec(`"${TEAM_DB}" "${escaped}"`, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) console.error('team-db error:', stderr || err.message);
      callback(err, stdout);
    });
  }

  runTeamDb(
    `CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      name TEXT,
      email TEXT UNIQUE,
      quiz_results TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      result_recommendation TEXT,
      welcome_email_sent INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const quizResultsStr = quizData ? JSON.stringify(quizData).replace(/'/g, "''") : '';
      const safeName = leadName.replace(/'/g, "''");
      const safeEmail = email.replace(/'/g, "''");
      const safeRec = recommendation.replace(/'/g, "''");
      const s_utm_source = utm_source.replace(/'/g, "''");
      const s_utm_medium = utm_medium.replace(/'/g, "''");
      const s_utm_campaign = utm_campaign.replace(/'/g, "''");
      const s_utm_content = utm_content.replace(/'/g, "''");
      const s_utm_term = utm_term.replace(/'/g, "''");

      runTeamDb(
        `INSERT OR IGNORE INTO leads (first_name, name, email, quiz_results, result_recommendation, utm_source, utm_medium, utm_campaign, utm_content, utm_term)
         VALUES ('${safeName}', '${safeName}', '${safeEmail}', '${quizResultsStr}', '${safeRec}', '${s_utm_source}', '${s_utm_medium}', '${s_utm_campaign}', '${s_utm_content}', '${s_utm_term}')`,
        (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.json({ success: true, message: 'Lead captured', score, recommendation });
        }
      );
    }
  );
});

// Fallback to index.html for SPA routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
