// server/index.js
// Main Express application entry point.
// Loads env, sets up middleware, mounts routes, and runs a startup DB check.

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import studySetsRouter from './routes/studysets.js';
import supabase from './db/supabase.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Allow all origins in dev (the Vite proxy handles this in production builds)
app.use(cors());

// Parse JSON bodies, limit to 1mb to prevent abuse
app.use(express.json({ limit: '1mb' }));

// --- Health check endpoint ---
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// --- Mount study sets router ---
app.use('/api/studysets', studySetsRouter);

// --- 404 fallback for unrecognised routes ---
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// --- Global error handler ---
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// --- Startup: verify DB connection ---
async function checkDatabaseConnection() {
  try {
    // A lightweight query just to confirm the table exists and credentials work
    const { error } = await supabase
      .from('study_sets')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅  Connected to Supabase — study_sets table is accessible.');
  } catch (err) {
    console.error('');
    console.error('⚠️  DATABASE CONNECTION CHECK FAILED');
    console.error('   Error:', err?.message || err);
    console.error('');
    console.error('   Please check:');
    console.error('   1. SUPABASE_URL is set correctly in server/.env');
    console.error('   2. SUPABASE_SERVICE_KEY is the service_role key (not anon key)');
    console.error('   3. The study_sets table exists in your Supabase project');
    console.error('      (run the SQL in server/db/schema.sql in your Supabase SQL Editor)');
    console.error('');
    console.error('   The server is still running so you can see this message,');
    console.error('   but API calls will fail until the database is configured.');
    console.error('');
  }
}

// --- Start server ---
app.listen(PORT, async () => {
  console.log('');
  console.log(`🚀  StudyBuddy AI server running on http://localhost:${PORT}`);
  console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
  console.log('');
  await checkDatabaseConnection();
});
