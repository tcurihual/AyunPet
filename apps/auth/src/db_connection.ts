<<<<<<< HEAD
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "/.env")
});
=======
import { createClient } from '@supabase/supabase-js';

// Ajustado para usar SUPABASE_API_KEY según configuración del líder
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY; // Cambiado de SUPABASE_KEY a SUPABASE_API_KEY
>>>>>>> b816f3e19ec83fba58066df899bbae9b6ccfba8e

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan variables de entorno de Supabase: SUPABASE_URL y SUPABASE_API_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey);