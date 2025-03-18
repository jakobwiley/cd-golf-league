import { createClient } from '@supabase/supabase-js';

// Supabase connection details from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase }; 