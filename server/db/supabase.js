// db/supabase.js
// Creates and exports the Supabase client using service role credentials.
// This file is used ONLY on the server — never expose the service key to the browser.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const missingUrl = !supabaseUrl || supabaseUrl.includes('your_supabase');
const missingKey = !supabaseServiceKey || supabaseServiceKey.includes('your_supabase');

if (missingUrl || missingKey) {
  console.error('');
  console.error('⚠️  SUPABASE NOT CONFIGURED');
  if (missingUrl)  console.error('   → SUPABASE_URL is missing or is still the placeholder value.');
  if (missingKey)  console.error('   → SUPABASE_SERVICE_KEY is missing or is still the placeholder value.');
  console.error('   Please edit server/.env with your real Supabase credentials.');
  console.error('   Find them at: https://supabase.com → Your Project → Settings → API');
  console.error('');
}

// Use dummy fallback URLs so createClient doesn't throw on startup.
// API calls will still fail — that's surfaced in the startup DB check in index.js.
const url = missingUrl ? 'https://placeholder.supabase.co' : supabaseUrl;
const key = missingKey ? 'placeholder_key' : supabaseServiceKey;

// createClient returns a singleton-like client; we export it for all routes to share.
const supabase = createClient(url, key, {
  auth: { persistSession: false }, // server-side: no session persistence needed
});

export default supabase;
