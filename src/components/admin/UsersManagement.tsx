
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Search, UserX, Trash2, Ban, UserCheck } from "lucide-react";
import { format } from "date-fns";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_anonymous: boolean;
}

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  
  // Fetch users using React Query
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      // In a real application, you would need server-side admin functions
      // for these operations since they require admin privileges
      // For demo purposes, we're simulating this data
      
      // This would be a call to a Supabase edge function with admin rights
      const mockUsers = [
        {
          id: "1",
          email: "user1@example.com",
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          banned_until: null,
          is_anonymous: false
        },
        {
          id: "2",
          email: "user2@example.com",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          last_sign_in_at: new Date(Date.now() - 3600000).toISOString(),
          banned_until: null,
          is_anonymous: false
        },
        {
          id: "3",
          email: "banned@example.com",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          last_sign_in_at: null,
          banned_until: new Date(Date.now() + 604800000).toISOString(),
          is_anonymous: false
        }
      ];
      
      return mockUsers;
    }
  });

  // Filter users by search term
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  );

  const handleDeleteUser = async (id: string) => {
    try {
      // In a real app, this would call an admin function to delete the user
      toast({
        title: "User deleted",
        description: "The user and their data have been removed",
      });
      
      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Deletion failed",
        description: "There was a problem deleting the user",
        variant: "destructive",
      });
    }
  };

  const handleBanUser = async (id: string) => {
    try {
      // In a real app, this would call an admin function to ban the user
      toast({
        title: "User banned",
        description: "The user has been banned from the platform",
      });
      
      setUserToBan(null);
      refetch();
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Ban failed",
        description: "There was a problem banning the user",
        variant: "destructive",
      });
    }
  };

  const handleUnbanUser = async (id: string) => {
    try {
      // In a real app, this would call an admin function to unban the user
      toast({
        title: "User unbanned",
        description: "The user has been unbanned",
      });
      
      refetch();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast({
        title: "Unban failed",
        description: "There was a problem unbanning the user",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users, ban or delete accounts
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
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user.banned_until ? (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleUnbanUser(user.id)}
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
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Ban User Confirmation */}
        <AlertDialog open={Boolean(userToBan)} onOpenChange={(open) => {
          if (!open) setUserToBan(null);
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ban User</AlertDialogTitle>
              <AlertDialogDescription>
                This will prevent the user from accessing the platform. You can unban them later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={() => userToBan && handleBanUser(userToBan)}
              >
                Ban User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
