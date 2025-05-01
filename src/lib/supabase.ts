
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing!");
}

// Add debug logging for development environment
if (import.meta.env.DEV) {
  console.log('Initializing Supabase client with:');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey ? 'Key provided (not shown for security)' : 'Key missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Debug helper to verify Supabase connection
export const verifySBConnection = async () => {
  try {
    const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

if (import.meta.env.DEV) {
  // Immediately verify connection in dev mode
  verifySBConnection();
}
