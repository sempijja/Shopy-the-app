
import { createClient } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Check if required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

// Create the Supabase client with the anonymous key for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Helper function to verify Supabase connection
export const verifySBConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("_dummy_query")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }

    console.log("Supabase connection verified successfully");
    return true;
  } catch (err) {
    console.error("Supabase connection error:", {
      message: err instanceof Error ? err.message : "Unknown error",
      details: err instanceof Error ? err.stack : String(err),
      hint: "",
      code: ""
    });
    return false;
  }
};

// Function to fetch user metadata
export const fetchUserMetadata = async (userId: string) => {
  try {
    if (!supabaseAdmin) {
      console.error("Admin client not available");
      return null;
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user metadata:", error);
      throw error;
    }

    const metadata = data.user?.user_metadata;
    return metadata;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// Function to fetch a user by ID
export const fetchUserById = async (userId: string) => {
  try {
    if (!supabaseAdmin) {
      console.error("Admin client not available");
      return null;
    }

    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
