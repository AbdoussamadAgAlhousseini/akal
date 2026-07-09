import 'server-only';

import {createClient} from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service_role key. This key bypasses
 * Row Level Security, so it must NEVER reach the browser — `server-only`
 * guarantees this module can only be imported from server code (API routes).
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, key, {auth: {persistSession: false}});
}
