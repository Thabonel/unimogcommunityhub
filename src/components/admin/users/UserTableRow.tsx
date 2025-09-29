
import { format } from "date-fns";
import { Ban, UserCheck, Shield, ShieldOff, Trash2, ExternalLink, Gift, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    banned_until: string | null;
    is_admin?: boolean;
    subscription?: {
      level: string;
      is_active: boolean;
      is_trial: boolean;
      expires_at: string | null;
      is_free_access?: boolean;
      free_access_reason?: string;
    };
  };
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onDelete: (userId: string) => void;
  onToggleAdmin: (userId: string, makeAdmin: boolean) => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
  onViewDetails: () => void;
}

export function UserTableRow({
  user,
  onBan,
  onUnban,
  onDelete,
  onToggleAdmin,
  isSelected,
  onSelectChange,
  onViewDetails
}: UserTableRowProps) {

  // Helper function to determine subscription type label
  const getSubscriptionTypeLabel = (subscription: any) => {
    if (!subscription) return 'Free';

    if (subscription.is_free_access) return 'Free Premium';
    if (subscription.is_trial) return 'Trial';

    // Map subscription levels to proper labels
    const level = subscription.level?.toLowerCase() || '';
    if (level.includes('monthly') || level.includes('month')) return 'Monthly';
    if (level.includes('yearly') || level.includes('year') || level.includes('annual')) return 'Yearly';
    if (level.includes('lifetime') || level.includes('permanent')) return 'Lifetime';

    // Fallback to the original level if no match
    return subscription.level || 'Premium';
  };
  return (
    <TableRow key={user.id}>
      <TableCell className="py-2">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelectChange}
          aria-label={`Select user ${user.email}`}
        />
      </TableCell>
      
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {user.email}
          <Button variant="ghost" size="icon" onClick={onViewDetails} title="View user details">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
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
          <Badge variant="destructive">
            Banned until {format(new Date(user.banned_until), 'MMM d, yyyy')}
          </Badge>
        ) : (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        )}
      </TableCell>
      
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {(() => {
                const subscriptionType = getSubscriptionTypeLabel(user.subscription);

                // Define colors and styles based on subscription type
                if (!user.subscription) {
                  return (
                    <Badge variant="outline" className="text-gray-600 dark:text-gray-400">
                      Free
                    </Badge>
                  );
                }

                if (user.subscription.is_free_access) {
                  return (
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                      <Gift className="h-3 w-3 mr-1" />
                      Free Premium
                    </Badge>
                  );
                }

                if (user.subscription.is_trial) {
                  return (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-400">
                      Trial
                    </Badge>
                  );
                }

                // For paid subscriptions, determine color based on type
                const isActive = user.subscription.is_active;
                let badgeClass = "";

                if (subscriptionType === 'Monthly') {
                  badgeClass = isActive ? "bg-orange-500 hover:bg-orange-600" : "";
                } else if (subscriptionType === 'Yearly') {
                  badgeClass = isActive ? "bg-purple-500 hover:bg-purple-600" : "";
                } else if (subscriptionType === 'Lifetime') {
                  badgeClass = isActive ? "bg-yellow-500 hover:bg-yellow-600" : "";
                } else {
                  badgeClass = isActive ? "bg-blue-500 hover:bg-blue-600" : "";
                }

                return (
                  <Badge variant={isActive ? "default" : "outline"} className={badgeClass}>
                    {subscriptionType}
                    {user.subscription.expires_at && !isActive && " (Expired)"}
                  </Badge>
                );
              })()}
            </TooltipTrigger>
            <TooltipContent>
              {user.subscription ? (
                <div>
                  {user.subscription.is_free_access ? (
                    <>
                      <p>Free access granted: {user.subscription.free_access_reason || 'Admin granted'}</p>
                      {user.subscription.expires_at && (
                        <p>Expires: {format(new Date(user.subscription.expires_at), 'MMM d, yyyy')}</p>
                      )}
                    </>
                  ) : user.subscription.is_trial ? (
                    <>
                      <p>Trial subscription</p>
                      {user.subscription.expires_at && (
                        <p>Expires: {format(new Date(user.subscription.expires_at), 'MMM d, yyyy')}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p>{getSubscriptionTypeLabel(user.subscription)} subscription</p>
                      <p>Status: {user.subscription.is_active ? 'Active' : 'Inactive'}</p>
                      {user.subscription.expires_at && (
                        <p>Expires: {format(new Date(user.subscription.expires_at), 'MMM d, yyyy')}</p>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p>No active subscription</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      <TableCell>
        {user.is_admin ? (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-400">
            <Shield className="h-3 w-3 mr-1" /> Admin
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-800 dark:text-gray-400">
            User
          </Badge>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {user.banned_until ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onUnban(user.id)}
              title="Unban user"
            >
              <UserCheck className="h-4 w-4 text-green-600" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onBan(user.id)}
              title="Ban user"
            >
              <Ban className="h-4 w-4 text-amber-600" />
            </Button>
          )}
          
          {user.is_admin ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleAdmin(user.id, false)}
              title="Remove admin privileges"
            >
              <ShieldOff className="h-4 w-4 text-purple-600" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleAdmin(user.id, true)}
              title="Make admin"
            >
              <Shield className="h-4 w-4 text-purple-600" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(user.id)}
            title="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
