
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./users/UsersTable";
import { BlockedEmailsList } from "./blockedEmails/BlockedEmailsList";
import { useUsersManagement } from "@/hooks/use-users-management";

export const UsersManagement = () => {
  const {
    blockedEmails,
    isLoadingBlockedEmails,
    showBlockEmailDialog,
    setShowBlockEmailDialog,
    blockEmail,
    unblockEmail
  } = useUsersManagement();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Manage users, ban or delete accounts, and assign admin privileges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
      
      {/* Blocked Emails Section */}
      <BlockedEmailsList 
        blockedEmails={blockedEmails}
        isLoading={isLoadingBlockedEmails}
        onBlockEmail={(email, reason) => blockEmail({ email, reason })}
        onUnblockEmail={unblockEmail}
      />
    </div>
  );
};

// Also export as default for compatibility with React.lazy()
export default UsersManagement;
