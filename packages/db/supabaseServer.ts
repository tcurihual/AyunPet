import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '') as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_API_KEY as string;

if (!SUPABASE_URL) throw new Error('Falta SUPABASE_URL en variables de entorno');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Falta SUPABASE_API_KEY en variables de entorno');

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
