import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

import { supabaseAdmin } from "@/lib/supabase";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL or Service Key is missing!");
}

// Admin client for server-side operations
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Function to fetch user metadata
export const fetchUserMetadata = async (userId: string) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user metadata:", error);
      throw error;
    }

    const metadata = data.user?.user_metadata;
    console.log("User metadata:", metadata);
    return metadata;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// Function to fetch a user by ID
export const fetchUserById = async (userId: string) => {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }

    console.log("Fetched user data:", data);
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};