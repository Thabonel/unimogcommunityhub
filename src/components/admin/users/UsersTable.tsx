
import { useUsersManagement } from "@/hooks/use-users-management";
import { UserSearchBox } from "./UserSearchBox";
import { UserTableContent } from "./UserTableContent";
import { UsersPagination } from "../UsersPagination";
import { UserToggleAdminDialog } from "./UserToggleAdminDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { BanUserDialog } from "../BanUserDialog";

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
  } = useUsersManagement();

  return (
    <div className="space-y-6">
      <UserSearchBox 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={refetch}
      />

      <UserTableContent 
        users={paginatedUsers}
        isLoading={isLoading}
        error={error}
        onBan={setUserToBan}
        onUnban={unbanUser}
        onDelete={setUserToDelete}
        onToggleAdmin={(userId, makeAdmin) => 
          setUserToToggleAdmin({ id: userId, makeAdmin })
        }
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
        data={userToToggleAdmin}
        onOpenChange={() => setUserToToggleAdmin(null)}
        onConfirm={handleToggleAdminRole}
      />
    </div>
  );
}
