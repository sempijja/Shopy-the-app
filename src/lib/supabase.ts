
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

// Add fetchUserMetadata function
export const fetchUserMetadata = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user metadata:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchUserMetadata:', error);
    return null;
  }
};
