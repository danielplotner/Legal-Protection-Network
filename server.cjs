const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Database strategy: on Render, use local JSON file (team-db not available)
// On the dev sandbox, use team-db CLI
const USE_LOCAL_DB = !!process.env.RENDER;
const DB_FILE = path.join(__dirname, 'data', 'leads.json');

const PERSONAL_URL = "https://danielplotner.legalshieldassociate.com/legal?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const SMB_URL = "https://danielplotner.legalshieldassociate.com/smb?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const IDSHIELD_URL = "https://danielplotner.legalshieldassociate.com/identity?utm_source=pbls&utm_medium=referral&utm_campaign=Share+Links&utm_content=623+WALS+Marketing+Site";
const LOGO_URL = "https://legalprotectionnetwork.com/logo.png"; // Placeholder or use branding colors
const OWNER_EMAIL = "dwp55555@gmail.com"; // From previous lead data or should be configurable

// Database helpers
const TEAM_DB = 'team-db';
function runTeamDb(sql, callback) {
  const escaped = sql.replace(/"/g, '\\"');
  exec(`"${TEAM_DB}" "${escaped}"`, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) console.error('team-db error:', stderr || err.message);
    callback(err, stdout);
  });
}

async function getLeads() {
  if (USE_LOCAL_DB) {
    try {
      if (!fs.existsSync(DB_FILE)) return [];
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading local leads:', e);
      return [];
    }
  } else {
    return new Promise((resolve) => {
      runTeamDb('SELECT * FROM leads ORDER BY created_at DESC', (err, stdout) => {
        if (err) return resolve([]);
        try {
          resolve(JSON.parse(stdout));
        } catch (e) {
          resolve([]);
        }
      });
    });
  }
}

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

// Email helper
async function sendResultsEmail(email, firstName, score, recommendation) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return;
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Decide which add-ons to show
  const isPersonalMatch = recommendation.includes('Personal') || recommendation.includes('Family');
  const isIDShieldMatch = recommendation.includes('IDShield');
  const isSMBMatch = recommendation.includes('Small Business') || recommendation.includes('SMB');

  try {
    console.log(`Attempting to send email to ${email}...`);
    const data = await resend.emails.send({
      from: 'Legal Protection Network <onboarding@resend.dev>', // Use onboarding@resend.dev for sandbox
      to: [email],
      subject: 'Your Legal Health Assessment Results 🛡️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a365d; margin: 0; font-size: 24px;">Legal Protection Network</h1>
            <p style="color: #d4af37; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Independent Associate of LegalShield</p>
          </div>

          <h2 style="color: #1a365d;">Hi ${firstName},</h2>
          <p style="font-size: 16px; color: #4a5568; line-height: 1.5;">
            Thank you for taking the time to complete the Legal Protection Network Health Check. Understanding your legal vulnerabilities is the first step toward peace of mind for your family and business.
          </p>
          
          <div style="background-color: #1a365d; color: #ffffff; padding: 30px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="text-transform: uppercase; font-size: 14px; font-weight: bold; color: #d4af37; margin-bottom: 10px;">Your Legal Health Score</p>
            <p style="font-size: 64px; font-weight: bold; margin: 0;">${score}/10</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
               <p style="font-size: 18px; margin: 0;">Our recommendation for you:</p>
               <p style="font-size: 22px; font-weight: bold; color: #d4af37; margin: 10px 0 0 0;">${recommendation}</p>
            </div>
          </div>

          <h3 style="color: #1a365d; border-bottom: 2px solid #f7fafc; padding-bottom: 10px; margin-top: 40px;">Complete Your Protection</h3>
          
          <!-- Category 1: Family -->
          ${!isPersonalMatch ? `
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #d4af37;">
            <h4 style="margin: 0; color: #1a365d;">For You & Your Family</h4>
            <p style="font-size: 14px; color: #4a5568; margin: 10px 0;">Get the Preferred Plan for comprehensive personal legal protection.</p>
            <p style="font-weight: bold; color: #1a365d; margin: 0;">$39.95/mo</p>
            <div style="margin-top: 15px;">
              <a href="${PERSONAL_URL}" style="background-color: #d4af37; color: #1a365d; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 14px;">Protect My Family →</a>
            </div>
          </div>
          ` : ''}

          <!-- Category 2: Identity -->
          ${!isIDShieldMatch ? `
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #d4af37;">
            <h4 style="margin: 0; color: #1a365d;">For Your Identity</h4>
            <p style="font-size: 14px; color: #4a5568; margin: 10px 0;">Comprehensive identity theft protection and restoration services.</p>
            <p style="font-weight: bold; color: #1a365d; margin: 0;">$14.95/mo</p>
            <div style="margin-top: 15px;">
              <a href="${IDSHIELD_URL}" style="background-color: #d4af37; color: #1a365d; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 14px;">Secure My Identity →</a>
            </div>
          </div>
          ` : ''}

          <!-- Category 3: Business -->
          ${!isSMBMatch ? `
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #d4af37;">
            <h4 style="margin: 0; color: #1a365d;">For Your Business</h4>
            <p style="font-size: 14px; color: #4a5568; margin: 10px 0;">Small business legal plans including document review and consultation.</p>
            <p style="font-weight: bold; color: #1a365d; margin: 0;">Starting at $49/mo</p>
            <div style="margin-top: 15px;">
              <a href="${SMB_URL}" style="background-color: #d4af37; color: #1a365d; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block; font-size: 14px;">Protect My Business →</a>
            </div>
          </div>
          ` : ''}
          
          <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="font-size: 12px; color: #a0aec0; margin-bottom: 10px;">
              *You will be directed to LegalShield to enroll.
            </p>
            <p style="font-size: 12px; color: #a0aec0;">
              © 2026 Legal Protection Network. Independent Associate of LegalShield.
            </p>
          </div>
        </div>
      `
    });
    console.log(`Email sent successfully to ${email}. ID: ${data.id || 'unknown'}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

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
      
      // Send email
      sendResultsEmail(email, finalFirstName, score, recommendation);
      
      return res.json({ success: true, message: 'Lead captured', score, recommendation });
    } catch (e) {
      console.error('Local DB error:', e);
      return res.status(500).json({ error: 'Database error' });
    }
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
    
    // Send email
    sendResultsEmail(email, finalFirstName, score, recommendation);
    
    res.json({ success: true, message: 'Lead captured', score, recommendation });
  });
});

// Admin Leads Page
app.get('/admin/leads', async (req, res) => {
  const leads = await getLeads();
  
  let rowsHtml = leads.map(lead => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-3">${lead.first_name || lead.name || ''}</td>
      <td class="p-3">${lead.email}</td>
      <td class="p-3">${lead.result_recommendation || ''}</td>
      <td class="p-3 text-xs text-gray-500">${lead.created_at}</td>
      <td class="p-3">${lead.utm_source || ''}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Leads Admin - Legal Protection Network</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">Captured Leads</h1>
          <a href="/api/leads/export" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow">
            Download CSV
          </a>
        </div>
        
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-gray-800 text-white">
              <tr>
                <th class="p-3">Name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Recommendation</th>
                <th class="p-3">Date</th>
                <th class="p-3">Source</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="5" class="p-8 text-center text-gray-500">No leads found</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// CSV Export Endpoint
app.get('/api/leads/export', async (req, res) => {
  const leads = await getLeads();
  const header = ['first_name', 'email', 'result_recommendation', 'quiz_results', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'created_at'];
  
  const csvContent = [
    header.join(','),
    ...leads.map(item => header.map(fieldName => {
      let value = item[fieldName] || '';
      if (fieldName === 'first_name' && !value) value = item.name || '';
      // Escape double quotes and wrap in double quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).send(csvContent);
});

// Daily CSV Email Endpoint for Owner
app.get('/api/leads/daily-csv', async (req, res) => {
  const leads = await getLeads();
  const header = ['first_name', 'email', 'result_recommendation', 'quiz_results', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'created_at'];
  
  const csvContent = [
    header.join(','),
    ...leads.map(item => header.map(fieldName => {
      let value = item[fieldName] || '';
      if (fieldName === 'first_name' && !value) value = item.name || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not set' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Legal Protection Network <onboarding@resend.dev>',
      to: [OWNER_EMAIL],
      subject: `Daily Leads Export - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>Daily Leads Report</h2>
          <p>Please find the latest leads export attached as a CSV file.</p>
          <p>Total Leads: <strong>${leads.length}</strong></p>
          <hr />
          <p style="font-size: 12px; color: #666;">Generated by Legal Protection Network Admin System</p>
        </div>
      `,
      attachments: [
        {
          filename: 'leads.csv',
          content: Buffer.from(csvContent).toString('base64'),
        },
      ],
    });
    res.json({ success: true, message: 'Daily CSV emailed to owner', count: leads.length });
  } catch (error) {
    console.error('Error sending daily CSV:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
