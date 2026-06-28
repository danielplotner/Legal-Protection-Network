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

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for lead capture
app.post('/api/leads', (req, res) => {
  const { name, email, quizData, utm_source, utm_medium, utm_campaign, utm_term, utm_content, first_name, quiz_results } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const recommendation = quizData?.recommendation || '';
  const score = quizData?.score || 0;

  // Capture UTM from body or query params
  const finalSource = utm_source || '';
  const finalMedium = utm_medium || '';
  const finalCampaign = utm_campaign || '';
  const finalTerm = utm_term || '';
  const finalContent = utm_content || '';
  const finalFirstName = first_name || name || ''; // Fallback to name if first_name not provided
  const finalQuizResults = quiz_results || (quizData ? JSON.stringify(quizData) : '');


  if (USE_LOCAL_DB) {
    // Production (Render): store in local JSON file
    try {
      const leads = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (leads.some(l => l.email === email)) {
        return res.json({ success: true, message: 'Lead already exists', score, recommendation });
      }
      const lead = {
        id: Date.now(),
        name: finalFirstName,
        first_name: finalFirstName,
        email,
        result_recommendation: recommendation,
        quiz_results: finalQuizResults,
        utm_source: finalSource,
        utm_medium: finalMedium,
        utm_campaign: finalCampaign,
        utm_term: finalTerm,
        utm_content: finalContent,
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

  const safeFirstName = finalFirstName.replace(/'/g, "''");
  const safeEmail = email.replace(/'/g, "''");
  const safeRec = recommendation.replace(/'/g, "''");
  const safeQuizResults = finalQuizResults.replace(/'/g, "''");
  const safeSource = finalSource.replace(/'/g, "''");
  const safeMedium = finalMedium.replace(/'/g, "''");
  const safeCampaign = finalCampaign.replace(/'/g, "''");
  const safeTerm = finalTerm.replace(/'/g, "''");
  const safeContent = finalContent.replace(/'/g, "''");

  const sql = `INSERT OR IGNORE INTO leads (name, first_name, email, result_recommendation, quiz_results, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
    VALUES ('${safeFirstName}', '${safeFirstName}', '${safeEmail}', '${safeRec}', '${safeQuizResults}', '${safeSource}', '${safeMedium}', '${safeCampaign}', '${safeTerm}', '${safeContent}')`;

  runTeamDb(sql, (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true, message: 'Lead captured', score, recommendation });
  });
});

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
