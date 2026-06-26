const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Database strategy: on Render, use local JSON file (team-db not available)
// On the dev sandbox, use team-db CLI
const USE_LOCAL_DB = !!process.env.RENDER;
const DB_FILE = path.join(__dirname, 'data', 'leads.json');

// Initialize local DB file if needed
if (USE_LOCAL_DB) {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]');
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.get("/health", (req, res) => res.send("OK"));

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for lead capture
app.post('/api/leads', (req, res) => {
  const { name, email, quizData, utm_source, utm_medium, utm_campaign, utm_term, utm_content } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const recommendation = quizData?.recommendation || '';
  const score = quizData?.score || 0;

  // Capture UTM from body or query params
  const uSource = utm_source || req.query.utm_source || '';
  const uMedium = utm_medium || req.query.utm_medium || '';
  const uCampaign = utm_campaign || req.query.utm_campaign || '';
  const uTerm = utm_term || req.query.utm_term || '';
  const uContent = utm_content || req.query.utm_content || '';

  if (USE_LOCAL_DB) {
    // Production (Render): store in local JSON file
    try {
      const leads = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (leads.some(l => l.email === email)) {
        return res.json({ success: true, message: 'Lead already exists', score, recommendation });
      }
      const lead = {
        id: Date.now(),
        name: name || '',
        email,
        result_recommendation: recommendation,
        utm_source: uSource,
        utm_medium: uMedium,
        utm_campaign: uCampaign,
        utm_term: uTerm,
        utm_content: uContent,
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

  const safeName = (name || '').replace(/'/g, "''");
  const safeEmail = email.replace(/'/g, "''");
  const safeRec = recommendation.replace(/'/g, "''");
  const safeSource = uSource.replace(/'/g, "''");
  const safeMedium = uMedium.replace(/'/g, "''");
  const safeCampaign = uCampaign.replace(/'/g, "''");
  const safeTerm = uTerm.replace(/'/g, "''");
  const safeContent = uContent.replace(/'/g, "''");

  const sql = `INSERT OR IGNORE INTO leads (name, email, result_recommendation, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES ('${safeName}', '${safeEmail}', '${safeRec}', '${safeSource}', '${safeMedium}', '${safeCampaign}', '${safeTerm}', '${safeContent}')`;

  runTeamDb(sql, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true, message: 'Lead captured', score, recommendation });
  });
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
