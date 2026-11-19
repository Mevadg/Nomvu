import { createClient } from '@supabase/supabase-js'; const supabaseUrl = 'TU_URL_AQUÍ'; const supabaseKey = 'TU_CLAVE_API_AQUÍ'; export const supabase = createClient(supabaseUrl, supabaseKey);
