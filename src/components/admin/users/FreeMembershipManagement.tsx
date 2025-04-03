
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserX } from "lucide-react";
import { useUsersManagement } from "@/hooks/users/use-users-management";
import { GiveFreeMembershipDialog } from "./GiveFreeMembershipDialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { format } from "date-fns";

export function FreeMembershipManagement() {
  const {
    freeAccessUsers,
    isLoadingFreeAccessUsers,
    refetchFreeAccessUsers,
    showGrantAccessDialog,
    setShowGrantAccessDialog,
    userToRevokeFreeAccess,
    setUserToRevokeFreeAccess,
    grantFreeAccess,
    revokeFreeAccess
  } = useUsersManagement();

  // Fetch free access users when component mounts
  useEffect(() => {
    refetchFreeAccessUsers();
  }, [refetchFreeAccessUsers]);

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Free Membership Management</CardTitle>
              <CardDescription>
                Manage users with free access to premium features
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowGrantAccessDialog(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Grant Free Access
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingFreeAccessUsers ? (
            <div className="flex justify-center py-8">
              <p>Loading free access users...</p>
            </div>
          ) : freeAccessUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users have been granted free access
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freeAccessUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.profiles?.avatar_url ? (
                            <AvatarImage src={user.profiles.avatar_url} alt={user.profiles.display_name || user.profiles.email} />
                          ) : (
                            <AvatarFallback>{user.profiles?.email?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.profiles?.display_name || user.profiles?.email}</div>
                          <div className="text-xs text-muted-foreground">{user.profiles?.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.starts_at)}</TableCell>
                    <TableCell>
                      {user.expires_at ? (
                        formatDate(user.expires_at)
                      ) : (
                        <Badge variant="purple">Never (Permanent)</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.free_access_reason || <span className="text-muted-foreground italic">No reason provided</span>}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserToRevokeFreeAccess(user.user_id)}
                      >
                        <UserX className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Grant Access Dialog */}
      <GiveFreeMembershipDialog
        isOpen={showGrantAccessDialog}
        onClose={() => setShowGrantAccessDialog(false)}
        onSuccess={() => refetchFreeAccessUsers()}
      />

      {/* Revoke Access Dialog */}
      <DeleteConfirmDialog
        open={Boolean(userToRevokeFreeAccess)}
        onOpenChange={(open) => {
          if (!open) setUserToRevokeFreeAccess(null);
        }}
        onConfirm={() => {
          if (userToRevokeFreeAccess) {
            revokeFreeAccess(userToRevokeFreeAccess);
          }
        }}
        title="Revoke Free Access"
        description="This will remove the user's free access to premium features. They will immediately lose access unless they have a paid subscription."
      />
    </>
  );
}
