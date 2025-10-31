import { createClient } from '@supabase/supabase-js';

// Normaliza la URL quitando el slash final si existe
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_API_KEY || '';

if (!SUPABASE_URL) {
  throw new Error('Falta SUPABASE_URL en variables de entorno');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Falta SUPABASE_API_KEY en variables de entorno');
}

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
