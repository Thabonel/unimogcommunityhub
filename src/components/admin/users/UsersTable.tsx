
import { useUsersManagement } from "@/hooks/use-users-management";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Ban, UserCheck, Shield, ShieldOff, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-grow">
          <Input
            placeholder="Search users by email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            startIcon={<span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">🔍</span>}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()}
          title="Refresh users"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          Error loading users. Please try again.
        </div>
      ) : paginatedUsers && paginatedUsers.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy') 
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    {user.banned_until ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
                        Banned until {format(new Date(user.banned_until), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500">
                        Active
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
                        User
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {user.banned_until ? (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => unbanUser(user.id)}
                          title="Unban user"
                        >
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setUserToBan(user.id)}
                          title="Ban user"
                        >
                          <Ban className="h-4 w-4 text-amber-600" />
                        </Button>
                      )}
                      
                      {user.is_admin ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUserToToggleAdmin({id: user.id, makeAdmin: false})}
                          title="Remove admin privileges"
                        >
                          <ShieldOff className="h-4 w-4 text-purple-600" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUserToToggleAdmin({id: user.id, makeAdmin: true})}
                          title="Make admin"
                        >
                          <Shield className="h-4 w-4 text-purple-600" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setUserToDelete(user.id)}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your search criteria.
        </div>
      )}
      
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
