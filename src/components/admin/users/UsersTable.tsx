
import { useUsersManagement } from "@/hooks/users/use-users-management";
import { UserSearchBox } from "./UserSearchBox";
import { UserTableContent } from "./UserTableContent";
import { UsersPagination } from "../UsersPagination";
import { UserToggleAdminDialog } from "./UserToggleAdminDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { BanUserDialog } from "../BanUserDialog";
import { UserFilters } from "./UserFilters";
import { Button } from "@/components/ui/button";
import { DownloadIcon, MessageSquareIcon, UsersIcon, RefreshCw, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { BulkFreeAccessDialog } from "./BulkFreeAccessDialog";
import { bulkGrantFreeAccess } from "@/utils/userMembershipOperations";
import { useToast } from "@/hooks/use-toast";

export function UsersTable() {
  const {
    paginatedUsers,
    isLoading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    userToDelete,
    userToBan,
    userToToggleAdmin,
    setSearchTerm,
    setCurrentPage,
    setUserToDelete,
    setUserToBan,
    setUserToToggleAdmin,
    refetch,
    banUser,
    unbanUser,
    deleteUser,
    handleToggleAdminRole,
    applyFilters,
    exportUsers,
    bulkMessageUsers,
    selectedUsers,
    toggleSelectUser,
    selectAllUsers,
    deselectAllUsers,
    filterOptions,
  } = useUsersManagement();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBulkFreeAccessDialog, setShowBulkFreeAccessDialog] = useState(false);
  const [bulkAccessType, setBulkAccessType] = useState<'permanent' | '1year'>('1year');
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  const { toast } = useToast();
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500); // Add minimum delay for UX
  };

  const handleBulkFreeAccess = async (reason: string) => {
    setIsBulkProcessing(true);

    try {
      const selectedUserEmails = paginatedUsers
        .filter(user => selectedUsers.includes(user.id))
        .map(user => user.email);

      const isPermanent = bulkAccessType === 'permanent';

      const results = await bulkGrantFreeAccess(selectedUserEmails, reason, isPermanent);

      // Show results
      if (results.success.length > 0) {
        toast({
          title: "Free access granted successfully",
          description: `${results.success.length} users received free access.`,
        });
      }

      if (results.failed.length > 0) {
        toast({
          title: `${results.failed.length} users failed`,
          description: `Some users could not be granted access. Check the logs for details.`,
          variant: "destructive",
        });
      }

      // Clear selections and refresh data
      deselectAllUsers();
      await refetch();
      setShowBulkFreeAccessDialog(false);

    } catch (error) {
      toast({
        title: "Error granting bulk access",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <UsersIcon className="mr-2 h-5 w-5" />
                User Management
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
              >
                <RefreshCw className={`mr-1 h-4 w-4 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UserSearchBox 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={refetch}
              />
              
              <UserFilters 
                filterOptions={filterOptions}
                onFilterChange={applyFilters}
              />

              {/* Error display */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
                    <div className="mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Bulk actions */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2 py-2 px-3 bg-muted/50 rounded-md">
                  <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
                  <div className="flex gap-2 ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => bulkMessageUsers(selectedUsers)}
                    >
                      <MessageSquareIcon className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportUsers(selectedUsers)}
                    >
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      Export
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Gift className="h-4 w-4 mr-1" />
                          Grant Free Access
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setBulkAccessType('1year');
                            setShowBulkFreeAccessDialog(true);
                          }}
                        >
                          1 Year Free Access
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setBulkAccessType('permanent');
                            setShowBulkFreeAccessDialog(true);
                          }}
                        >
                          Permanent Free Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}

              <UserTableContent 
                users={paginatedUsers}
                isLoading={isLoading || isRefreshing}
                error={error}
                onBan={setUserToBan}
                onUnban={unbanUser}
                onDelete={setUserToDelete}
                onToggleAdmin={(userId, makeAdmin) => 
                  setUserToToggleAdmin({ userId, makeAdmin })
                }
                selectedUsers={selectedUsers}
                onSelectUser={toggleSelectUser}
                onSelectAll={selectAllUsers}
                onDeselectAll={deselectAllUsers}
                onViewUserDetails={(userId) => window.open(`/admin/users/${userId}`, '_blank')}
              />
              
              {/* Pagination */}
              {totalPages > 1 && !isLoading && !error && (
                <div className="mt-4 flex justify-center">
                  <UsersPagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete User Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null);
        }}
        onConfirm={() => userToDelete && deleteUser(userToDelete)}
        title="Delete User"
        description="This will permanently delete the user and all their associated data. This action cannot be undone."
      />
      
      {/* Ban User Dialog */}
      <BanUserDialog 
        open={Boolean(userToBan)}
        onOpenChange={(open) => {
          if (!open) setUserToBan(null);
        }}
        onConfirm={(duration, reason) => userToBan && banUser({ userId: userToBan, duration, reason })}
      />
      
      {/* Toggle Admin Role Confirmation */}
      <UserToggleAdminDialog
        data={userToToggleAdmin ? { id: userToToggleAdmin.userId, makeAdmin: userToToggleAdmin.makeAdmin } : null}
        onOpenChange={() => setUserToToggleAdmin(null)}
        onConfirm={handleToggleAdminRole}
      />

      {/* Bulk Free Access Dialog */}
      <BulkFreeAccessDialog
        open={showBulkFreeAccessDialog}
        onOpenChange={setShowBulkFreeAccessDialog}
        selectedUsers={paginatedUsers.filter(user => selectedUsers.includes(user.id))}
        accessType={bulkAccessType}
        onConfirm={handleBulkFreeAccess}
        isProcessing={isBulkProcessing}
      />
    </div>
  );
}
