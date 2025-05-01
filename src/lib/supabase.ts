
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Supabase URL is missing!");
}

if (!supabaseServiceKey && import.meta.env.DEV) {
  console.warn("Supabase Service Key is missing in development mode!");
}

// Create the main supabase client (using anon key for client-side operations)
export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || supabaseServiceKey || ""
);

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl || "", supabaseServiceKey)
  : null;

// Function to fetch user metadata
export const fetchUserMetadata = async (userId: string) => {
  try {
    if (!supabaseAdmin) {
      console.error("Admin client not available to fetch user metadata");
      return null;
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user metadata:", error);
      return null;
    }

    const metadata = data.user?.user_metadata;
    console.log("User metadata:", metadata);
    return metadata;
  } catch (err) {
    console.error("Error in fetchUserMetadata:", err);
    return null;
  }
};

// Function to fetch a user by ID
export const fetchUserById = async (userId: string) => {
  try {
    if (!supabaseAdmin) {
      console.error("Admin client not available to fetch user by ID");
      return null;
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }

    console.log("Fetched user data:", data);
    return data;
  } catch (err) {
    console.error("Error in fetchUserById:", err);
    return null;
  }
};

// Function to verify Supabase connection
export const verifySBConnection = async () => {
  try {
    // Use a simple query that's likely to exist in most Supabase instances
    // or handle the error gracefully if it doesn't
    const { error } = await supabase.from('_dummy_query').select('*').limit(1);
    if (error) {
      if (error.code === '42P01') { // Relation does not exist
        console.error("Supabase connection error:", error);
        // This is actually expected since _dummy_query probably doesn't exist
        // Try another approach - just checking if we can reach the API
        const { data: healthCheck } = await supabase.from('healthcheck').select('count').then(
          () => ({ data: true }),
          () => ({ data: false })
        );
        if (healthCheck) {
          console.log("Supabase connection verified via alternative check");
          return true;
        }
      } else {
        throw error;
      }
    } else {
      console.log("Supabase connection verified successfully");
      return true;
    }
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
};
