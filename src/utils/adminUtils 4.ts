
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Function to add admin role to a user
export const addAdminRole = async (userId: string): Promise<boolean> => {
  console.log("Adding admin role for user:", userId);
  
  // Always perform actual database operations
  
  try {
    const { error } = await supabase
      .from("user_roles")
      .insert([
        { user_id: userId, role: "admin" }
      ]);
    
    if (error) {
      console.error("Error adding admin role:", error);
      return false;
    }
    
    console.log("Admin role added successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Exception adding admin role:", error);
    return false;
  }
};

// Function to remove admin role from a user
export const removeAdminRole = async (userId: string): Promise<boolean> => {
  // Always perform actual database operations
  
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");
    
    if (error) {
      console.error("Error removing admin role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception removing admin role:", error);
    return false;
  }
};

// Function to check if a user has admin role
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  console.log("Checking admin status for userId:", userId);
  
  // Always check actual admin status from database
  
  try {
    // First try using RPC function
    const { data: rpcData, error: rpcError } = await supabase.rpc("has_role", {
      _role: "admin",
    });
    
    if (!rpcError) {
      console.log("Admin check via RPC result:", rpcData);
      return !!rpcData;
    }

    console.warn("RPC for admin check failed, falling back to direct query:", rpcError);
    
    // Fallback to direct query if RPC fails
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (roleError) {
      console.error("Error checking admin status via direct query:", roleError);
      return false;
    }
    
    console.log("Admin check via direct query result:", !!roleData);
    return !!roleData;
  } catch (error) {
    console.error("Exception checking admin status:", error);
    return false;
  }
};

// Function to grant admin role to yourself (for first-time setup)
export const makeYourselfAdmin = async (): Promise<boolean> => {
  console.log("Making yourself admin...");
  
  // Always perform actual database operations
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      return false;
    }
    
    console.log("Attempting to add admin role for user:", user.id);
    return await addAdminRole(user.id);
  } catch (error) {
    console.error("Exception making yourself admin:", error);
    return false;
  }
};
