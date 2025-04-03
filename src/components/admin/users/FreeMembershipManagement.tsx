
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GiveFreeMembershipDialog } from "./GiveFreeMembershipDialog";
import { format } from "date-fns";
import { getFreeAccessUsers, revokeFreeAccess } from "@/utils/userMembershipOperations";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Gift, RefreshCcw, XCircle, TicketCheck } from "lucide-react";

interface FreeAccessUser {
  id: string;
  user_id: string;
  created_at: string;
  subscription_level: string;
  is_active: boolean;
  expires_at: string | null;
  free_access_reason: string | null;
  profiles: {
    email: string;
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function FreeMembershipManagement() {
  const [users, setUsers] = useState<FreeAccessUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFreeUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getFreeAccessUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load free access users:", error);
      toast({
        title: "Error",
        description: "Failed to load users with free access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFreeUsers();
  }, []);

  const handleRevoke = async (userId: string) => {
    try {
      await revokeFreeAccess(userId);
      toast({
        title: "Access revoked",
        description: "Free access has been revoked successfully"
      });
      // Refresh the list after revoking
      await loadFreeUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to revoke access",
        variant: "destructive"
      });
    } finally {
      setUserToRevoke(null);
    }
  };

  const getInitials = (name: string | null): string => {
    if (!name) return "U";
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <TicketCheck className="mr-2 h-5 w-5 text-primary" />
              Free Membership Management
            </CardTitle>
            <CardDescription>
              Grant and manage free access to premium features
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadFreeUsers}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Gift className="h-4 w-4 mr-1" />
              Grant Free Access
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center border rounded-md bg-muted/20">
            <Gift className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No free memberships</h3>
            <p className="text-muted-foreground">
              No users currently have free access. Grant access to add them here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Granted On</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const name = user.profiles.display_name || user.profiles.full_name || user.profiles.email;
                const initials = getInitials(name);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.profiles.avatar_url ? (
                            <AvatarImage src={user.profiles.avatar_url} alt={name} />
                          ) : (
                            <AvatarFallback>{initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-xs text-muted-foreground">{user.profiles.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {user.expires_at ? (
                        format(new Date(user.expires_at), 'MMM d, yyyy')
                      ) : (
                        <Badge variant="secondary">Permanent</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.free_access_reason || <span className="text-muted-foreground italic">No reason provided</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRevoke(user.user_id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Dialog for granting free access */}
      <GiveFreeMembershipDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadFreeUsers}
      />
    </Card>
  );
}
