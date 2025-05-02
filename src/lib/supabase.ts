
import { createClient } from "@supabase/supabase-js";

// Set default values for development environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-for-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-for-supabase-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
});
