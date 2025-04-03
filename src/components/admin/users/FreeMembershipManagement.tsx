
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, RefreshCw, Search, Trash } from "lucide-react";
import { useState } from "react";
import { GiveFreeMembershipDialog } from "./GiveFreeMembershipDialog";
import { useFreeMembershipManagement } from "@/hooks/users/use-free-membership-management";
import { Skeleton } from "@/components/ui/skeleton";

export function FreeMembershipManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const { isLoading, error, freeMemberships, revokeMembership, refreshData } = useFreeMembershipManagement();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMemberships = freeMemberships.filter(
    (membership) =>
      membership.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Free Membership Management</CardTitle>
          <CardDescription>Manage users with free access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-red-500 mb-4">Error loading free membership data</p>
            <Button onClick={refreshData}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle>Free Membership Management</CardTitle>
          <CardDescription>Manage users with free access to premium features</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name or email..."
            className="pl-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredMemberships.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">No free memberships found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm ? "Try a different search term" : "Add your first free membership"}
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemberships.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center justify-between p-3 rounded-md border"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground">
                    {(membership.user.name || membership.user.email || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{membership.user.name || "Unnamed User"}</p>
                    <p className="text-sm text-muted-foreground">{membership.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="capitalize">
                    {membership.reason || "manual grant"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(membership.expiresAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => revokeMembership(membership.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Revoke</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <GiveFreeMembershipDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onComplete={refreshData}
      />
    </Card>
  );
}
