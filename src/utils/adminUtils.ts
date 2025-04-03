
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

// Function to add admin role to a user
export const addAdminRole = async (userId: string): Promise<boolean> => {
  console.log("Adding admin role for user:", userId);
  
  // For development mode, simulate success
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Simulating admin role addition");
    toast({
      title: "Success",
      description: "Admin role assigned successfully (development mode)",
    });
    return true;
  }
  
  try {
    const { error } = await supabase
      .from("user_roles")
      .insert([
        { user_id: userId, role: "admin" }
      ]);
    
    if (error) {
      console.error("Error adding admin role:", error);
      toast({
        title: "Error",
        description: "Failed to assign admin role",
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Admin role added successfully for user:", userId);
    toast({
      title: "Success",
      description: "Admin role assigned successfully",
    });
    return true;
  } catch (error) {
    console.error("Exception adding admin role:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Function to remove admin role from a user
export const removeAdminRole = async (userId: string): Promise<boolean> => {
  // For development mode, simulate success
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Simulating admin role removal");
    toast({
      title: "Success",
      description: "Admin role removed successfully (development mode)",
    });
    return true;
  }
  
  try {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "admin");
    
    if (error) {
      console.error("Error removing admin role:", error);
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Admin role removed successfully",
    });
    return true;
  } catch (error) {
    console.error("Exception removing admin role:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Function to check if a user has admin role
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  console.log("Checking admin status for userId:", userId);
  
  // For development mode, always return true
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Always returning true for admin check");
    return true;
  }
  
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
  
  // For development mode, simulate success
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Simulating makeYourselfAdmin success");
    toast({
      title: "Success",
      description: "Admin role granted (development mode)",
    });
    return true;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      toast({
        title: "Error",
        description: "You need to be logged in to perform this action",
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Attempting to add admin role for user:", user.id);
    return await addAdminRole(user.id);
  } catch (error) {
    console.error("Exception making yourself admin:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Add these new functions to work with our Edge Function
export const fetchAdminUsers = async () => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Returning mock data for fetchAdminUsers");
    return [
      {
        id: "dev-1",
        email: "admin@example.com",
        created_at: "2025-01-01T00:00:00.000Z",
        last_sign_in_at: "2025-03-30T10:45:00.000Z",
        is_admin: true
      },
      {
        id: "dev-2",
        email: "user@example.com",
        created_at: "2025-02-15T00:00:00.000Z",
        last_sign_in_at: "2025-04-01T08:30:00.000Z",
        is_admin: false
      }
    ];
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Not authenticated");
    }
    
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { operation: 'get_all_users' },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast({
      title: "Error fetching users",
      description: error.message || "Could not load user data",
      variant: "destructive",
    });
    throw error;
  }
};

export const adminDeleteUser = async (userId: string): Promise<boolean> => {
  // For development mode, simulate success
  if (process.env.NODE_ENV === 'development') {
    console.log(`Development mode: Simulating deletion of user ${userId}`);
    toast({
      title: "Success",
      description: "User deleted successfully (development mode)",
    });
    return true;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { 
        operation: 'delete_user',
        userId
      },
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast({
      title: "Failed to delete user",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};
