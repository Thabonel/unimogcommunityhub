
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "./users/UsersTable";
import { BlockedEmailsList } from "./blockedEmails/BlockedEmailsList";
import { useUsersManagement } from "@/hooks/users/use-users-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreeMembershipManagement } from "./users/FreeMembershipManagement";
import { Users, Ban, TicketCheck } from "lucide-react";

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
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="blocked-emails" className="flex items-center gap-1">
            <Ban className="h-4 w-4" />
            <span>Blocked Emails</span>
          </TabsTrigger>
          <TabsTrigger value="free-memberships" className="flex items-center gap-1">
            <TicketCheck className="h-4 w-4" />
            <span>Free Memberships</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          {/* User Management Section */}
          <UsersTable />
        </TabsContent>
        
        <TabsContent value="blocked-emails" className="space-y-4">
          {/* Blocked Emails Section */}
          <BlockedEmailsList 
            blockedEmails={blockedEmails}
            isLoading={isLoadingBlockedEmails}
            onBlockEmail={(email, reason) => blockEmail({ email, reason })}
            onUnblockEmail={unblockEmail}
          />
        </TabsContent>
        
        <TabsContent value="free-memberships" className="space-y-4">
          {/* Free Memberships Section */}
          <FreeMembershipManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Also export as default for compatibility with React.lazy()
export default UsersManagement;
