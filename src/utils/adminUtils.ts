
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Function to add admin role to a user
export const addAdminRole = async (userId: string): Promise<boolean> => {
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
  try {
    const { data, error } = await supabase.rpc("has_role", {
      _role: "admin",
    });
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking admin status:", error);
    return false;
  }
};

// Function to grant admin role to yourself (for first-time setup)
export const makeYourselfAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to perform this action",
        variant: "destructive",
      });
      return false;
    }
    
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
