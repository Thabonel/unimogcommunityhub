
import { useUsersManagement } from "@/hooks/use-users-management";
import { UserSearchBox } from "./UserSearchBox";
import { UserTableContent } from "./UserTableContent";
import { UsersPagination } from "../UsersPagination";
import { UserToggleAdminDialog } from "./UserToggleAdminDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { BanUserDialog } from "../BanUserDialog";
import { UserFilters } from "./UserFilters"; // New component for filtering
import { Button } from "@/components/ui/button";
import { DownloadIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <UsersIcon className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
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
                  </div>
                </div>
              )}

              <UserTableContent 
                users={paginatedUsers}
                isLoading={isLoading}
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
              {totalPages > 1 && (
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
    </div>
  );
}
