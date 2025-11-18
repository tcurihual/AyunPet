import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "./.env")
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase: SUPABASE_URL y SUPABASE_API_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);