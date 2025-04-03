
import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export function useUsersSelection() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // User selection functions
  const toggleSelectUser = useCallback((userId: string, isSelected: boolean) => {
    setSelectedUsers(prev => 
      isSelected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  }, []);
  
  const selectAllUsers = useCallback((userIds: string[]) => {
    setSelectedUsers(userIds);
  }, []);
  
  const deselectAllUsers = useCallback(() => {
    setSelectedUsers([]);
  }, []);
  
  // Bulk operations
  const exportUsers = useCallback((users: any[], userIds: string[]) => {
    const selectedUserData = users
      .filter(user => userIds.includes(user.id))
      .map(({ id, email, created_at, last_sign_in_at, subscription }) => ({
        id,
        email,
        created_at,
        last_sign_in_at,
        subscription_status: subscription 
          ? `${subscription.is_trial ? 'Trial' : subscription.level} (${subscription.is_active ? 'Active' : 'Inactive'})`
          : 'Free'
      }));
    
    const jsonString = JSON.stringify(selectedUserData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Users Exported',
      description: `Exported data for ${userIds.length} users.`
    });
  }, [toast]);
  
  const bulkMessageUsers = useCallback((userIds: string[]) => {
    // For demonstration - we'd implement actual messaging functionality here
    console.log('Send message to users:', userIds);
    toast({
      title: 'Bulk Message',
      description: `Message dialog would open for ${userIds.length} users.`
    });
    // This would typically open a dialog to compose a message
  }, [toast]);
  
  return {
    selectedUsers,
    toggleSelectUser,
    selectAllUsers,
    deselectAllUsers,
    exportUsers,
    bulkMessageUsers
  };
}
