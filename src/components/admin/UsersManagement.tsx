import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { RefreshCw, Search, Ban, UserCheck, Shield, ShieldOff, Trash2 } from "lucide-react";
import { BanUserDialog } from "./BanUserDialog";
import { BlockedEmailsList } from "./BlockedEmailsList";
import { UsersPagination } from "./UsersPagination";
import { useUsersManagement } from "@/hooks/use-users-management";
import { addAdminRole, removeAdminRole } from "@/utils/adminUtils";

export const UsersManagement = () => {
  const {
    paginatedUsers,
    blockedEmails,
    isLoading,
    isLoadingBlockedEmails,
    error,
    searchTerm,
    currentPage,
    totalPages,
    userToDelete,
    userToBan,
    userToToggleAdmin,
    showBlockEmailDialog,
    setSearchTerm,
    setCurrentPage,
    setUserToDelete,
    setUserToBan,
    setUserToToggleAdmin,
    setShowBlockEmailDialog,
    refetch,
    banUser,
    unbanUser,
    deleteUser,
    blockEmail,
    unblockEmail
  } = useUsersManagement();
  
  const handleToggleAdminRole = async (userId: string, makeAdmin: boolean) => {
    try {
      let success;
      
      if (makeAdmin) {
        success = await addAdminRole(userId);
      } else {
        success = await removeAdminRole(userId);
      }
      
      if (success) {
        refetch();
      }
      
      setUserToToggleAdmin(null);
    } catch (error) {
      console.error("Error toggling admin role:", error);
    }
  };

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
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
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
        </CardContent>
      </Card>
      
      {/* Blocked Emails Section */}
      <BlockedEmailsList 
        blockedEmails={blockedEmails}
        isLoading={isLoadingBlockedEmails}
        onBlockEmail={(email, reason) => blockEmail({ email, reason })}
        onUnblockEmail={unblockEmail}
      />
      
      {/* Delete User Confirmation */}
      <AlertDialog open={Boolean(userToDelete)} onOpenChange={(open) => {
        if (!open) setUserToDelete(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user and all their associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => userToDelete && deleteUser(userToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Ban User Dialog */}
      <BanUserDialog 
        open={Boolean(userToBan)}
        onOpenChange={(open) => {
          if (!open) setUserToBan(null);
        }}
        onConfirm={(duration, reason) => userToBan && banUser({ userId: userToBan, duration, reason })}
      />
      
      {/* Toggle Admin Role Confirmation */}
      <AlertDialog open={Boolean(userToToggleAdmin)} onOpenChange={(open) => {
        if (!open) setUserToToggleAdmin(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggleAdmin?.makeAdmin ? "Grant Admin Privileges" : "Remove Admin Privileges"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggleAdmin?.makeAdmin 
                ? "This will give the user full administrative access to the platform."
                : "This will remove the user's administrative access to the platform."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={userToToggleAdmin?.makeAdmin 
                ? "bg-purple-600 text-white hover:bg-purple-700" 
                : "bg-gray-600 text-white hover:bg-gray-700"
              }
              onClick={() => userToToggleAdmin && handleToggleAdminRole(userToToggleAdmin.id, userToToggleAdmin.makeAdmin)}
            >
              {userToToggleAdmin?.makeAdmin ? "Make Admin" : "Remove Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Also export as default for compatibility with React.lazy()
export default UsersManagement;
